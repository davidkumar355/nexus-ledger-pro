import { getBankTransactions } from '@/lib/bank'
import SourceGroup from '@/components/bank/SourceGroup'
import BankTxnForm from '@/components/bank/BankTxnForm'

export default async function BankLedgerPage() {
  const transactions = await getBankTransactions()

  // Group transactions by source
  const grouped = transactions.reduce((acc, txn) => {
    if (!acc[txn.source]) {
      acc[txn.source] = {
        transactions: [],
        netBalance: 0
      }
    }
    acc[txn.source].transactions.push(txn)
    // netBalance: credits add to balance, debits subtract
    acc[txn.source].netBalance += txn.type === 'credit' ? Number(txn.amount) : -Number(txn.amount)
    return acc
  }, {} as Record<string, { transactions: typeof transactions, netBalance: number }>)

  const sortedSources = Object.keys(grouped).sort()
  const existingSources = sortedSources

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 w-full block">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase text-ink">Bank & UPI Ledger</h1>
        <p className="font-bold text-gray-700">Track your accounts and running balances.</p>
      </div>

      <BankTxnForm existingSources={existingSources} />

      <div className="flex flex-col gap-4 mt-4">
        {sortedSources.length === 0 ? (
          <div className="p-8 border-4 border-ink bg-white text-center font-black uppercase text-gray-500">
            No transactions yet. Add one above!
          </div>
        ) : (
          sortedSources.map((source) => (
            <SourceGroup
              key={source}
              source={source}
              transactions={grouped[source].transactions}
              netBalance={grouped[source].netBalance}
            />
          ))
        )}
      </div>
    </div>
  )
}
