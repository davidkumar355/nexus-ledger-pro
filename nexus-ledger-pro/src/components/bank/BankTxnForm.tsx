'use client'

import { useState } from 'react'
import { addBankTransaction } from '@/lib/bank'
import { Plus } from 'lucide-react'

type Props = {
  existingSources: string[]
}

export default function BankTxnForm({ existingSources }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    source: '',
    type: 'debit' as 'credit' | 'debit',
    amount: '',
    note: '',
    txn_date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addBankTransaction({
        source: formData.source,
        type: formData.type,
        amount: Number(formData.amount),
        note: formData.note,
        txn_date: formData.txn_date,
      })
      setFormData({ ...formData, amount: '', note: '' })
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      alert('Failed to add transaction')
    }
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 bg-canvas border-4 border-ink shadow-brutal active:translate-y-1 active:shadow-none transition-all font-black uppercase flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Log Bank Transaction
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-canvas border-4 border-ink shadow-brutal flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-black uppercase">New Transaction</h2>
        <button type="button" onClick={() => setIsOpen(false)} className="text-ink hover:underline font-bold">
          Close
        </button>
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Source (Bank/UPI/Wallet)</label>
        <input
          required
          type="text"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="w-full p-3 bg-white border-4 border-ink font-bold focus:outline-none focus:ring-0"
          placeholder="e.g. SBI, Axis, GPay"
        />
        {existingSources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {existingSources.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData({ ...formData, source: s })}
                className="px-2 py-1 text-xs border-2 border-ink font-bold hover:bg-ink hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={formData.type === 'debit'}
              onChange={() => setFormData({ ...formData, type: 'debit' })}
              className="w-4 h-4 accent-ink"
            />
            Debit (Spent)
          </label>
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={formData.type === 'credit'}
              onChange={() => setFormData({ ...formData, type: 'credit' })}
              className="w-4 h-4 accent-ink"
            />
            Credit (Received)
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-black uppercase text-sm mb-1">Amount (₹)</label>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-3 bg-white border-4 border-ink font-bold focus:outline-none focus:ring-0"
          />
        </div>
        <div>
          <label className="block font-black uppercase text-sm mb-1">Date</label>
          <input
            required
            type="date"
            value={formData.txn_date}
            onChange={(e) => setFormData({ ...formData, txn_date: e.target.value })}
            className="w-full p-3 bg-white border-4 border-ink font-bold focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div>
        <label className="block font-black uppercase text-sm mb-1">Note (Optional)</label>
        <input
          type="text"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full p-3 bg-white border-4 border-ink font-bold focus:outline-none focus:ring-0"
          placeholder="What was this for?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 mt-2 bg-success border-4 border-ink shadow-brutal active:translate-y-1 active:shadow-none transition-all font-black uppercase text-white disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  )
}
