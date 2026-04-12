import { getAllTransactions } from '@/lib/journal'
import JournalRow from '@/components/JournalRow'

export default async function JournalPage() {
  const transactions = await getAllTransactions()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight">Global Journal</h1>
      <p className="mb-8 text-neutral-600 font-medium">A unified timeline of all your financial activity across banks, cards, and friends.</p>
      
      {transactions.length === 0 ? (
        <div className="p-8 text-center border-4 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 mt-8 font-mono">
          NO TRANSACTIONS RECORDED YET.
        </div>
      ) : (
        <div className="flex flex-col">
          {transactions.map(txn => (
            <JournalRow key={txn.id} entry={txn} />
          ))}
        </div>
      )}
    </div>
  )
}
