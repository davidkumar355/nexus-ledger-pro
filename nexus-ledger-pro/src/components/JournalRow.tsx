import { JournalEntry } from '@/lib/journal'
import { Landmark, CreditCard, User } from 'lucide-react'

export default function JournalRow({ entry }: { entry: JournalEntry }) {
  const isPositive = entry.amount > 0

  const getIcon = () => {
    switch (entry.type) {
      case 'bank': return <Landmark className="w-5 h-5 text-neutral-700" />
      case 'iou': return <User className="w-5 h-5 text-neutral-700" />
      case 'cc_reset': return <CreditCard className="w-5 h-5 text-neutral-700" />
      default: return <Landmark className="w-5 h-5 text-neutral-700" />
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-2 border-primary bg-white shadow-block mb-4 transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="hidden sm:block p-2 border-2 border-primary bg-[#F4F4F5]">
          {getIcon()}
        </div>
        <div>
          <p className="font-bold text-lg">{entry.sourceOrName}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
            <span className="font-mono text-xs px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded">
              {entry.date ? entry.date.slice(0, 10) : 'Date'}
            </span>
            <span className="opacity-50">&bull;</span>
            <span className="truncate max-w-[150px] sm:max-w-xs">{entry.description}</span>
          </div>
        </div>
      </div>
      <div className={`font-mono font-bold text-xl whitespace-nowrap ${isPositive ? 'text-green-600' : ''}`}>
        {isPositive ? '+' : '-'}₹{Math.abs(entry.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  )
}
