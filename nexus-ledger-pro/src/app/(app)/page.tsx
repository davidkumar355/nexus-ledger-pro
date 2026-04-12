export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-black text-4xl uppercase tracking-tight">Dashboard</h1>
        <p className="text-ink/50 font-medium mt-1">Your financial command centre</p>
      </div>

      {/* Placeholder stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card-brutal p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/50 mb-2">
            Total Credit Available
          </p>
          <p className="font-black text-3xl">—</p>
        </div>
        <div className="card-brutal p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/50 mb-2">
            Net Friend Balance
          </p>
          <p className="font-black text-3xl">—</p>
        </div>
      </div>

      <p className="text-ink/30 text-sm font-medium">
        Add credit cards, bank transactions, and IOUs using the + button below.
      </p>
    </div>
  )
}
