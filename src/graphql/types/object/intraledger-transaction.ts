import { GT } from "@graphql/index"
import ITransaction from "../abstract/transaction"
import PaymentInitiationMethod from "../scalar/payment-initiation-method"
import SatAmount from "../scalar/sat-amount"
import SettlementMethod from "../scalar/settlement-method"
import Timestamp from "../scalar/timestamp"
import Username from "../scalar/username"
import Memo from "../scalar/memo"
import TxDirection, { txDirectionValues } from "../scalar/tx-direction"
import TxStatus from "../scalar/tx-status"
// import BtcUsdPrice from "./btc-usd-price"
import { SettlementMethod as DomainSettlementMethod } from "@domain/wallets"

const IntraLedgerTransaction = new GT.Object({
  name: "IntraLedgerTransaction",
  interfaces: () => [ITransaction],
  isTypeOf: (source) => source.settlementVia === DomainSettlementMethod.IntraLedger,
  fields: () => ({
    id: {
      type: GT.NonNullID,
    },
    initiationVia: {
      type: GT.NonNull(PaymentInitiationMethod),
    },
    settlementVia: {
      type: GT.NonNull(SettlementMethod),
    },
    settlementAmount: {
      type: GT.NonNull(SatAmount),
    },
    settlementFee: {
      type: GT.NonNull(SatAmount),
    },
    // priceAtSettlement: {
    //   type: GT.NonNull(BtcUsdPrice),
    // },
    memo: {
      type: Memo,
    },
    direction: {
      type: GT.NonNull(TxDirection),
      resolve: (source) =>
        source.settlementAmount > 0 ? txDirectionValues.RECEIVE : txDirectionValues.SEND,
    },
    status: {
      type: TxStatus,
    },
    createdAt: {
      type: GT.NonNull(Timestamp),
    },

    // Non-interface fields
    recipientUsername: {
      type: Username,
      description:
        "Settlement destination: Could be null when originalDestination is onChain/LN" +
        " and the payee does not have a username",
    },
  }),
})

export default IntraLedgerTransaction
