'use client'

import { useState } from 'react'
import { logSpend } from '@/lib/cards'

export default function LogSpendButton({ cardId }: { cardId: string }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0) return

    setLoading(true)
    try {
      await logSpend(cardId, val)
      setAmount('')
    } catch (err) {
      console.error(err)
      alert('Failed to log spend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLog} className="flex gap-2 w-full mt-4">
      <input
        type="number"
        step="0.01"
        placeholder="₹ Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="flex-1 bg-canvas border-2 border-ink px-2 md:px-3 py-2 text-sm font-bold focus:shadow-brutal outline-none transition-shadow"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-warning text-ink border-2 border-ink font-black text-sm px-4 py-2 hover:bg-warning/80 active:translate-y-1 transition-all disabled:opacity-50"
      >
        LOG
      </button>
    </form>
  )
}
