import { getCurrentPrice } from "@app/prices"
import { BTC_NETWORK, getOnChainWalletConfig, ONCHAIN_SCAN_DEPTH_OUTGOING } from "@config"
import { checkedToSats, checkedToTargetConfs, toSats } from "@domain/bitcoin"
import { PaymentSendStatus } from "@domain/bitcoin/lightning"
import { checkedToOnChainAddress, TxDecoder } from "@domain/bitcoin/onchain"
import {
  InsufficientBalanceError,
  LessThanDustThresholdError,
  NotImplementedError,
  RebalanceNeededError,
  SelfPaymentError,
} from "@domain/errors"
import { DisplayCurrencyConverter } from "@domain/fiat/display-currency"
import {
  PaymentInputValidator,
  WalletCurrency,
  WithdrawalFeeCalculator,
} from "@domain/wallets"
import { LockService } from "@services"
import { LedgerService } from "@services/ledger"
import { OnChainService } from "@services/lnd/onchain-service"
import { baseLogger } from "@services/logger"
import {
  AccountsRepository,
  UsersRepository,
  WalletsRepository,
} from "@services/mongoose"
import { NotificationsService } from "@services/notifications"

import {
  checkAndVerifyTwoFA,
  checkIntraledgerLimits,
  checkWithdrawalLimits,
} from "./check-limit-helpers"
import { getOnChainFee } from "./get-on-chain-fee"

const { dustThreshold } = getOnChainWalletConfig()

export const payOnChainByWalletIdWithTwoFA = async ({
  senderAccount,
  senderWalletId,
  amount: amountRaw,
  address,
  targetConfirmations,
  memo,
  sendAll,
  twoFAToken,
}: PayOnChainByWalletIdWithTwoFAArgs): Promise<PaymentSendStatus | ApplicationError> => {
  const amount = sendAll
    ? await LedgerService().getWalletBalance(senderWalletId)
    : checkedToSats(amountRaw)
  if (amount instanceof Error) return amount

  const user = await UsersRepository().findById(senderAccount.ownerId)
  if (user instanceof Error) return user
  const { twoFA } = user

  // FIXME: inefficient. wallet also fetched in lnSendPayment
  const senderWallet = await WalletsRepository().findById(senderWalletId)
  if (senderWallet instanceof Error) return senderWallet

  const displayCurrencyPerSat = await getCurrentPrice()
  if (displayCurrencyPerSat instanceof Error) return displayCurrencyPerSat

  const dCConverter = DisplayCurrencyConverter(displayCurrencyPerSat)
  // End FIXME

  const twoFACheck = twoFA?.secret
    ? await checkAndVerifyTwoFA({
        walletId: senderWalletId,
        walletCurrency: senderWallet.currency,
        dCConverter,
        amount,
        twoFASecret: twoFA.secret,
        twoFAToken,
        account: senderAccount,
      })
    : true
  if (twoFACheck instanceof Error) return twoFACheck

  return payOnChainByWalletId({
    senderAccount,
    senderWalletId,
    amount,
    address,
    targetConfirmations,
    memo,
    sendAll,
  })
}

export const payOnChainByWalletId = async ({
  senderAccount,
  senderWalletId,
  amount: amountRaw,
  address,
  targetConfirmations,
  memo,
  sendAll,
}: PayOnChainByWalletIdArgs): Promise<PaymentSendStatus | ApplicationError> => {
  const checkedAmount = sendAll
    ? await LedgerService().getWalletBalance(senderWalletId)
    : checkedToSats(amountRaw)
  if (checkedAmount instanceof Error) return checkedAmount

  const validator = PaymentInputValidator(WalletsRepository().findById)
  const validationResult = await validator.validatePaymentInput({
    amount: checkedAmount,
    senderAccount,
    senderWalletId,
  })
  if (validationResult instanceof Error) return validationResult

  const { amount, senderWallet } = validationResult

  const onchainLogger = baseLogger.child({
    topic: "payment",
    protocol: "onchain",
    transactionType: "payment",
    address,
    amount,
    memo,
    sendAll,
  })
  const checkedAddress = checkedToOnChainAddress({
    network: BTC_NETWORK,
    value: address,
  })
  if (checkedAddress instanceof Error) return checkedAddress

  const checkedTargetConfirmations = checkedToTargetConfs(targetConfirmations)
  if (checkedTargetConfirmations instanceof Error) return checkedTargetConfirmations

  const wallets = WalletsRepository()
  const recipientWallet = await wallets.findByAddress(checkedAddress)
  const isIntraLedger = !(recipientWallet instanceof Error)

  if (isIntraLedger)
    return executePaymentViaIntraledger({
      senderAccount,
      senderWallet,
      recipientWallet,
      amount,
      address: checkedAddress,
      memo,
      sendAll,
      logger: onchainLogger,
    })

  return executePaymentViaOnChain({
    senderWallet,
    senderAccount,
    amount,
    address: checkedAddress,
    targetConfirmations: checkedTargetConfirmations,
    memo,
    sendAll,
    logger: onchainLogger,
  })
}

const executePaymentViaIntraledger = async ({
  senderAccount,
  senderWallet,
  recipientWallet,
  amount,
  address,
  memo,
  sendAll,
  logger,
}: {
  senderAccount: Account
  senderWallet: Wallet
  recipientWallet: Wallet
  amount: CurrencyBaseAmount
  address: OnChainAddress
  memo: string | null
  sendAll: boolean
  logger: Logger
}): Promise<PaymentSendStatus | ApplicationError> => {
  if (recipientWallet.id === senderWallet.id) return new SelfPaymentError()

  // TODO Usd use case
  if (
    !(
      recipientWallet.currency === WalletCurrency.Btc &&
      senderWallet.currency === WalletCurrency.Btc
    )
  ) {
    return new NotImplementedError("USD intraledger")
  }
  const amountSats = toSats(amount)

  const displayCurrencyPerSat = await getCurrentPrice()
  if (displayCurrencyPerSat instanceof Error) return displayCurrencyPerSat

  const dCConverter = DisplayCurrencyConverter(displayCurrencyPerSat)

  const intraledgerLimitCheck = await checkIntraledgerLimits({
    amount,
    dCConverter,
    walletId: senderWallet.id,
    walletCurrency: senderWallet.currency,
    account: senderAccount,
  })
  if (intraledgerLimitCheck instanceof Error) return intraledgerLimitCheck

  const amountDisplayCurrency = dCConverter.fromSats(amountSats)

  const recipientAccount = await AccountsRepository().findById(recipientWallet.accountId)
  if (recipientAccount instanceof Error) return recipientAccount

  return LockService().lockWalletId(
    { walletId: senderWallet.id, logger },
    async (lock) => {
      const balance = await LedgerService().getWalletBalance(senderWallet.id)
      if (balance instanceof Error) return balance
      if (balance < amount)
        return new InsufficientBalanceError(
          `Payment amount '${amount}' exceeds balance '${balance}'`,
        )

      const onchainLoggerOnUs = logger.child({ balance, onUs: true })
      const journal = await LockService().extendLock(
        { logger: onchainLoggerOnUs, lock },
        async () =>
          LedgerService().addOnChainIntraledgerTxTransfer({
            senderWalletId: senderWallet.id,
            senderWalletCurrency: senderWallet.currency,
            senderUsername: senderAccount.username,
            description: "",
            sats: amountSats,
            amountDisplayCurrency,
            payeeAddresses: [address],
            sendAll,
            recipientWalletId: recipientWallet.id,
            recipientWalletCurrency: recipientWallet.currency,
            recipientUsername: recipientAccount.username,
            memoPayer: memo ?? null,
          }),
      )
      if (journal instanceof Error) return journal

      const notificationsService = NotificationsService(logger)
      notificationsService.intraLedgerPaid({
        senderWalletId: senderWallet.id,
        recipientWalletId: recipientWallet.id,
        amount: amountSats,
        displayCurrencyPerSat,
      })

      onchainLoggerOnUs.info(
        {
          success: true,
          type: "onchain_on_us",
          pending: false,
          amountDisplayCurrency,
        },
        "onchain payment succeed",
      )

      return PaymentSendStatus.Success
    },
  )
}

const executePaymentViaOnChain = async ({
  senderWallet,
  senderAccount,
  amount,
  address,
  targetConfirmations,
  memo,
  sendAll,
  logger,
}: {
  senderWallet: Wallet
  senderAccount: Account
  amount: CurrencyBaseAmount
  address: OnChainAddress
  targetConfirmations: TargetConfirmations
  memo: string | null
  sendAll: boolean
  logger: Logger
}): Promise<PaymentSendStatus | ApplicationError> => {
  // TODO Usd use case
  if (senderWallet.currency !== WalletCurrency.Btc) {
    return new NotImplementedError("USD Intraledger")
  }

  const amountSats = toSats(amount)

  const ledgerService = LedgerService()
  const withdrawFeeCalculator = WithdrawalFeeCalculator()

  const onChainService = OnChainService(TxDecoder(BTC_NETWORK))
  if (onChainService instanceof Error) return onChainService

  const displayCurrencyPerSat = await getCurrentPrice()
  if (displayCurrencyPerSat instanceof Error) return displayCurrencyPerSat

  const dCConverter = DisplayCurrencyConverter(displayCurrencyPerSat)

  const withdrawalLimitCheck = await checkWithdrawalLimits({
    amount,
    dCConverter,
    walletId: senderWallet.id,
    walletCurrency: senderWallet.currency,
    account: senderAccount,
  })
  if (withdrawalLimitCheck instanceof Error) return withdrawalLimitCheck

  const estimatedFee = await getOnChainFee({
    walletId: senderWallet.id,
    account: senderAccount,
    amount,
    address,
    targetConfirmations,
  })
  if (estimatedFee instanceof Error) return estimatedFee

  const amountToSend = sendAll ? toSats(amount - estimatedFee) : amountSats

  if (amountToSend < dustThreshold)
    return new LessThanDustThresholdError(
      `Use lightning to send amounts less than ${dustThreshold}`,
    )

  const onChainAvailableBalance = await onChainService.getBalance()
  if (onChainAvailableBalance instanceof Error) return onChainAvailableBalance
  if (onChainAvailableBalance < amountToSend + estimatedFee)
    return new RebalanceNeededError()

  return LockService().lockWalletId(
    { walletId: senderWallet.id, logger },
    async (lock) => {
      const balance = await LedgerService().getWalletBalance(senderWallet.id)
      if (balance instanceof Error) return balance
      if (balance < amountToSend + estimatedFee) {
        return new InsufficientBalanceError(
          `${amountToSend + estimatedFee} exceeds balance ${balance}`,
        )
      }

      const journal = await LockService().extendLock({ logger, lock }, async () => {
        const txHash = await onChainService.payToAddress({
          address,
          amount: amountToSend,
          targetConfirmations,
        })
        if (txHash instanceof Error) {
          logger.error(
            { err: txHash, address, tokens: amountToSend, success: false },
            "Impossible to sendToChainAddress",
          )
          return txHash
        }

        let totalFee: Satoshis

        const minerFee = await onChainService.lookupOnChainFee({
          txHash,
          scanDepth: ONCHAIN_SCAN_DEPTH_OUTGOING,
        })

        if (minerFee instanceof Error) {
          logger.error({ err: minerFee }, "impossible to get fee for onchain payment")
          totalFee = estimatedFee
        } else {
          totalFee = withdrawFeeCalculator.onChainWithdrawalFee({
            minerFee,
            bankFee: toSats(senderAccount.withdrawFee),
          })
        }

        const sats = toSats(amountToSend + totalFee)

        const amountDisplayCurrency = dCConverter.fromSats(sats)
        const totalFeeDisplayCurrency = dCConverter.fromSats(totalFee)

        return ledgerService.addOnChainTxSend({
          walletId: senderWallet.id,
          walletCurrency: senderWallet.currency,
          txHash,
          description: memo || "",
          sats,
          totalFee,
          bankFee: senderAccount.withdrawFee,
          amountDisplayCurrency,
          payeeAddress: address,
          sendAll,
          totalFeeDisplayCurrency,
        })
      })
      if (journal instanceof Error) return journal

      return PaymentSendStatus.Success
    },
  )
}