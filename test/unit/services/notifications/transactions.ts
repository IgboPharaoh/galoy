import { NotificationType } from "@domain/notifications"
import { WalletCurrency } from "@domain/shared"
import { DisplayCurrency } from "@domain/fiat"

const CRC = "CRC" as DisplayCurrency
export const btcTransactions = [
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    body: "+1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    body: "Sent payment of 1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    body: "+1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    body: "pending +1,000 sats",
    title: "BTC Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    body: "Sent onchain payment of 1,000 sats confirmed",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    body: "+1,000 sats",
    title: "BTC Transaction",
  },
]

export const btcTransactionsWithDisplayCurrency = [
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5 | 1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "Sent payment of $5 | 1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5 | 1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "pending +$5 | 1,000 sats",
    title: "BTC Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "Sent onchain payment of +$5 | 1,000 sats confirmed",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5 | 1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: { amount: 500, currency: CRC },
    body: "+₡500 | 1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: { amount: 500, currency: CRC },
    body: "Sent payment of ₡500 | 1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: { amount: 500, currency: CRC },
    body: "+₡500 | 1,000 sats",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: { amount: 500, currency: CRC },
    body: "pending +₡500 | 1,000 sats",
    title: "BTC Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: { amount: 500, currency: CRC },
    body: "Sent onchain payment of +₡500 | 1,000 sats confirmed",
    title: "BTC Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Btc },
    displayPaymentAmount: { amount: 500, currency: CRC },
    body: "+₡500 | 1,000 sats",
    title: "BTC Transaction",
  },
]

export const usdTransactions = [
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Usd },
    body: "+$10",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Usd },
    body: "Sent payment of $10",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Usd },
    body: "+$10",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Usd },
    body: "pending +$10",
    title: "USD Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Usd },
    body: "Sent onchain payment of $10 confirmed",
    title: "USD Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 1000n, currency: WalletCurrency.Usd },
    body: "+$10",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 1030n, currency: WalletCurrency.Usd },
    body: "+$10.3",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 1030n, currency: WalletCurrency.Usd },
    body: "Sent payment of $10.3",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 1030n, currency: WalletCurrency.Usd },
    body: "+$10.3",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 1030n, currency: WalletCurrency.Usd },
    body: "pending +$10.3",
    title: "USD Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 1030n, currency: WalletCurrency.Usd },
    body: "Sent onchain payment of $10.3 confirmed",
    title: "USD Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 1030n, currency: WalletCurrency.Usd },
    body: "+$10.3",
    title: "USD Transaction",
  },
]

export const usdTransactionsWithDisplayCurrency = [
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "Sent payment of $5",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "pending +$5",
    title: "USD Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "Sent onchain payment of $5 confirmed",
    title: "USD Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "+₡3,500 | $5",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "Sent payment of ₡3,500 | $5",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "+₡3,500 | $5",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "pending +₡3,500 | $5",
    title: "USD Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "Sent onchain payment of +₡3,500 | $5 confirmed",
    title: "USD Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 500n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "+₡3,500 | $5",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5.07",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "Sent payment of $5.07",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5.07",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "pending +$5.07",
    title: "USD Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "Sent onchain payment of $5.07 confirmed",
    title: "USD Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 5,
      currency: DisplayCurrency.Usd,
    },
    body: "+$5.07",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerReceipt,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "+₡3,500 | $5.07",
    title: "USD Transaction",
  },
  {
    type: NotificationType.IntraLedgerPayment,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "Sent payment of ₡3,500 | $5.07",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceipt,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "+₡3,500 | $5.07",
    title: "USD Transaction",
  },
  {
    type: NotificationType.OnchainReceiptPending,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "pending +₡3,500 | $5.07",
    title: "USD Transaction | Pending",
  },
  {
    type: NotificationType.OnchainPayment,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "Sent onchain payment of +₡3,500 | $5.07 confirmed",
    title: "USD Transaction",
  },
  {
    type: NotificationType.LnInvoicePaid,
    paymentAmount: { amount: 507n, currency: WalletCurrency.Usd },
    displayPaymentAmount: {
      amount: 3500,
      currency: CRC,
    },
    body: "+₡3,500 | $5.07",
    title: "USD Transaction",
  },
]
