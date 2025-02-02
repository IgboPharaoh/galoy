import { toSats } from "@domain/bitcoin"
import { MajorExponent, toCents } from "@domain/fiat"
import { LedgerTransactionType } from "@domain/ledger"
import { FeeReimbursement } from "@domain/ledger/fee-reimbursement"
import { DisplayPriceRatio, WalletPriceRatio } from "@domain/payments"
import {
  displayAmountFromNumber,
  paymentAmountFromNumber,
  WalletCurrency,
} from "@domain/shared"

import * as LedgerFacade from "@services/ledger/facade"
import { baseLogger } from "@services/logger"

export const reimburseFee = async <
  S extends WalletCurrency,
  R extends WalletCurrency,
  T extends DisplayCurrency,
>({
  paymentFlow,
  senderDisplayAmount,
  senderDisplayCurrency,
  journalId,
  actualFee,
  revealedPreImage,
}: {
  paymentFlow: PaymentFlow<S, R>
  senderDisplayAmount: DisplayCurrencyBaseAmount
  senderDisplayCurrency: T
  journalId: LedgerJournalId
  actualFee: Satoshis
  revealedPreImage?: RevealedPreImage
}): Promise<true | ApplicationError> => {
  const actualFeeAmount = paymentAmountFromNumber({
    amount: actualFee,
    currency: WalletCurrency.Btc,
  })
  if (actualFeeAmount instanceof Error) return actualFeeAmount

  const maxFeeAmounts = {
    btc: paymentFlow.btcProtocolAndBankFee,
    usd: paymentFlow.usdProtocolAndBankFee,
  }

  const priceRatio = WalletPriceRatio(paymentFlow.paymentAmounts())
  if (priceRatio instanceof Error) return priceRatio

  const feeDifference = FeeReimbursement({
    prepaidFeeAmount: maxFeeAmounts,
    priceRatio,
  }).getReimbursement(actualFeeAmount)
  if (feeDifference instanceof Error) {
    baseLogger.warn(
      { maxFee: maxFeeAmounts, actualFee: actualFeeAmount },
      `Invalid reimbursement fee`,
    )
    return true
  }

  // TODO: only reimburse fees is this is above a (configurable) threshold
  // ie: adding an entry for 1 sat fees may not be the best scalability wise for the db
  if (feeDifference.btc.amount === 0n) {
    return true
  }

  const displayAmount = displayAmountFromNumber({
    amount: senderDisplayAmount,
    currency: senderDisplayCurrency,
  })
  if (displayAmount instanceof Error) return displayAmount

  const displayPriceRatio = DisplayPriceRatio({
    displayAmountInMinorUnit: displayAmount,
    walletAmount: paymentFlow.btcPaymentAmount,
    displayMajorExponent: MajorExponent.STANDARD,
  })
  if (displayPriceRatio instanceof Error) return displayPriceRatio
  const reimburseAmountDisplayCurrency = displayPriceRatio.convertFromWallet(
    feeDifference.btc,
  )
  const reimburseAmountAsNumber = Number(
    reimburseAmountDisplayCurrency.amountInMinor,
  ) as DisplayCurrencyBaseAmount

  const paymentHash = paymentFlow.paymentHashForFlow()
  if (paymentHash instanceof Error) return paymentHash

  const metadata: FeeReimbursementLedgerMetadata = {
    hash: paymentHash,
    type: LedgerTransactionType.LnFeeReimbursement,
    pending: false,
    related_journal: journalId,

    satsAmount: toSats(feeDifference.btc.amount),
    centsAmount: toCents(feeDifference.usd.amount),
    satsFee: toSats(0),
    centsFee: toCents(0),

    displayAmount: reimburseAmountAsNumber,
    displayFee: 0 as DisplayCurrencyBaseAmount,
    displayCurrency: senderDisplayCurrency,
  }

  const txMetadata: LnLedgerTransactionMetadataUpdate = {
    hash: paymentHash,
    revealedPreImage,
  }

  baseLogger.info(
    {
      feeDifference,
      maxFee: maxFeeAmounts,
      actualFee,
      paymentHash: paymentFlow.paymentHash,
    },
    "logging a fee difference",
  )

  const result = await LedgerFacade.recordReceive({
    description: "fee reimbursement",
    recipientWalletDescriptor: paymentFlow.senderWalletDescriptor(),
    amountToCreditReceiver: {
      usd: feeDifference.usd,
      btc: feeDifference.btc,
    },
    metadata,
    txMetadata,
  })
  if (result instanceof Error) return result

  return true
}
