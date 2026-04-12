'use client'

import { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { deleteBankTransaction } from '@/lib/bank'
import type { BankTransaction } from '@/lib/bank'

type Props = {
  source: string
  transactions: BankTransaction[]
  netBalance: number
}

export default function SourceGroup({ source, transactions, netBalance }: Props) {
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
      await deleteBankTransaction(id)
    } catch (error) {
      console.error(error)
      alert('Failed to delete transaction')
    }
    setDeletingId(null)
  }

  return (
    <div className="bg-white border-4 border-ink shadow-brutal mb-4">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-canvas border-b-4 border-ink text-left"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black uppercase">{source}</h2>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        <div className={`text-xl font-black ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {netBalance >= 0 ? '+' : '-'}{formatINR(netBalance)}
        </div>
      </button>

      {/* Transaction List */}
      {isOpen && (
        <div className="flex flex-col">
          {transactions.map((txn, index) => (
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
                {txn.note && <div className="font-bold">{txn.note}</div>}
              </div>
              <div className="flex items-center gap-4">
                <div className={`font-black text-lg ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.type === 'credit' ? '+' : '-'}{formatINR(txn.amount)}
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
          ))}
        </div>
      )}
    </div>
  )
}
