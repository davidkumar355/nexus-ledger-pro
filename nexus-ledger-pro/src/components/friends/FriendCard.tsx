'use client'

import { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { deleteFriendTransaction } from '@/lib/friends'
import type { FriendWithBalance } from '@/lib/friends'

type Props = {
  friendData: FriendWithBalance
}

export default function FriendCard({ friendData }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    setDeletingId(id)
    try {
      await deleteFriendTransaction(id)
    } catch (error) {
      console.error(error)
      alert('Failed to delete transaction')
    }
    setDeletingId(null)
  }

  // Determine balance display
  const { name, netBalance, transactions } = friendData
  let statusText = 'Settled up'
  let textColorClass = 'text-gray-500'
  
  if (netBalance > 0) {
    statusText = `Owes you ${formatINR(netBalance)}`
    textColorClass = 'text-green-600'
  } else if (netBalance < 0) {
    statusText = `You owe ${formatINR(netBalance)}`
    textColorClass = 'text-red-600'
  }

  return (
    <div className="bg-white border-4 border-ink shadow-brutal mb-4">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-canvas border-b-4 border-ink text-left transition-colors hover:bg-[#FFE81A]"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black uppercase">{name}</h2>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          <div className={`font-bold ${textColorClass}`}>
            {statusText}
          </div>
        </div>
      </button>

      {/* Transaction List */}
      {isOpen && (
        <div className="flex flex-col">
          {transactions.length === 0 ? (
            <div className="p-4 font-bold text-gray-500 italic">No transactions yet.</div>
          ) : (
            transactions.map((txn, index) => (
              <div
                key={txn.id}
                className={`p-4 flex items-center justify-between ${
                  index < transactions.length - 1 ? 'border-b-4 border-ink' : ''
                }`}
              >
                <div>
                  <div className="font-black uppercase text-sm text-gray-500 mb-1">
                    {new Date(txn.txn_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black uppercase text-xs">
                      {txn.type === 'lent' && 'Lent to friend'}
                      {txn.type === 'borrowed' && 'Borrowed from friend'}
                      {txn.type === 'settled' && 'Settlement'}
                    </span>
                    {txn.note && <span className="font-bold text-gray-700">{txn.note}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`font-black text-lg ${
                    txn.type === 'lent' ? 'text-green-600' :
                    txn.type === 'borrowed' ? 'text-red-600' :
                    'text-gray-800'
                  }`}>
                    {formatINR(txn.amount)}
                  </div>
                  <button
                    onClick={() => handleDelete(txn.id)}
                    disabled={deletingId === txn.id}
                    className="p-2 border-2 border-ink bg-danger text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="Delete Transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
