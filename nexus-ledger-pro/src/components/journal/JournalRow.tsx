import type { JournalEntry } from '@/lib/journal'

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function JournalRow({ entry }: { entry: JournalEntry }) {
  const isPositive = entry.amount >= 0

  let badgeColor = ''
  let badgeText = ''
  if (entry.type === 'bank') {
    badgeColor = 'bg-ink text-white'
    badgeText = 'BANK'
  } else if (entry.type === 'iou') {
    badgeColor = 'bg-warning text-ink'
    badgeText = 'IOU'
  } else {
    badgeColor = 'bg-danger text-white'
    badgeText = 'CC'
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-ink/20 hover:bg-canvas/50 transition-colors">
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black uppercase text-gray-500 w-24">
            {formatDate(entry.date)}
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${badgeColor} inline-block`}>
            {badgeText}
          </span>
        </div>
        <div className="flex flex-col ml-1 sm:ml-0">
          <span className="font-bold text-ink">{entry.description}</span>
          <span className="text-xs font-bold text-gray-500 uppercase">{entry.sourceOrName}</span>
        </div>
      </div>
      
      <div className={`font-black text-right min-w-[120px] ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : '-'}{formatINR(entry.amount)}
      </div>
    </div>
  )
}
