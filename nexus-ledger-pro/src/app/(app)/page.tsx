import Link from 'next/link'
import { getDashboardStats } from '@/lib/dashboard'
import { getAllTransactions } from '@/lib/journal'
import StatCard from '@/components/dashboard/StatCard'
import JournalRow from '@/components/JournalRow'
import { inr } from '@/lib/format'

export const metadata = {
  title: 'Dashboard | Nexus Ledger Pro'
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, allTransactions] = await Promise.all([
    getDashboardStats(),
    getAllTransactions()
  ])
  
  const recentTransactions = allTransactions.slice(0, 5)

  return (
    <div className="space-y-8 pb-24">
      <div className="mb-6">
        <h1 className="text-4xl font-black uppercase mb-1">Dashboard</h1>
        <p className="font-medium text-lg text-ink/70">Your financial position at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          label="Total Credit Available" 
          value={inr(stats.totalCreditAvailable)}
          colorTheme={stats.totalCreditAvailable >= 0 ? 'success' : 'danger'}
        />
        
        <StatCard
          label="Net Friend Balance"
          value={stats.totalNetFriendBalance < 0 ? `-${inr(Math.abs(stats.totalNetFriendBalance))}` : inr(stats.totalNetFriendBalance)}
          colorTheme={stats.totalNetFriendBalance > 0 ? 'success' : stats.totalNetFriendBalance < 0 ? 'danger' : 'net-zero'}
        />
      </div>

      <div className="mt-12 bg-white border-4 border-ink shadow-brutal p-4 sm:p-8">
        <div className="flex justify-between items-end mb-6 border-b-4 border-ink pb-4">
          <div>
            <h2 className="text-2xl font-black uppercase">Recent Activity</h2>
            <p className="font-medium text-ink/70 text-sm">Last 5 transactions across all categories</p>
          </div>
          <Link href="/journal" className="hidden sm:inline-block font-black uppercase tracking-wider text-sm hover:underline hover:bg-warning px-2 py-1">
            View All →
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-12 text-center font-black uppercase text-gray-400">
            No transactions yet.
          </div>
        ) : (
          <div className="flex flex-col">
            {recentTransactions.map((txn) => (
              <JournalRow key={txn.id} entry={txn} />
            ))}
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Link href="/journal" className="block text-center border-2 border-ink py-3 font-black uppercase tracking-wider hover:bg-warning transition-colors bg-canvas">
            View All Transactions →
          </Link>
        </div>
      </div>
    </div>
  )
}
