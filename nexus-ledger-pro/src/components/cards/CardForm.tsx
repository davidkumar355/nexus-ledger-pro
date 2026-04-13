'use client'

import { useState } from 'react'
import { createCard, updateCard } from '@/lib/cards'

type CardFormProps = {
  initialData?: {
    id: string
    name: string
    total_limit: number
    spent: number
    reset_day: number
  }
  onClose: () => void
}

export default function CardForm({ initialData, onClose }: CardFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [limit, setLimit] = useState(initialData?.total_limit?.toString() || '')
  const [spent, setSpent] = useState(initialData?.spent?.toString() || '')
  const [resetDay, setResetDay] = useState(initialData?.reset_day?.toString() || '')
  const [loading, setLoading] = useState(false)
  const isEditing = !!initialData

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const payload = {
      name,
      total_limit: parseFloat(limit),
      spent: parseFloat(spent) || 0,
      reset_day: parseInt(resetDay, 10),
    }

    try {
      if (isEditing) {
        await updateCard(initialData.id, payload)
      } else {
        await createCard(payload)
      }
      onClose()
    } catch (err: any) {
      console.error(err)
      alert((isEditing ? 'Failed to update card: ' : 'Failed to create card: ') + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
      <div className="bg-canvas border-4 border-ink p-6 w-full max-w-md shadow-brutal relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 font-black border-2 border-ink bg-danger text-ink w-8 h-8 flex items-center justify-center hover:translate-y-1 transition-transform"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-black uppercase mb-6">{isEditing ? 'Edit Card' : 'Add New Card'}</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm uppercase">Card Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="border-2 border-ink p-2 focus:shadow-brutal outline-none transition-shadow"
              placeholder="e.g. HDFC Millennia"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm uppercase">Total Limit</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={limit}
              onChange={e => setLimit(e.target.value)}
              className="border-2 border-ink p-2 focus:shadow-brutal outline-none transition-shadow"
              placeholder="50000"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm uppercase">Current Spent</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={spent}
              onChange={e => setSpent(e.target.value)}
              className="border-2 border-ink p-2 focus:shadow-brutal outline-none transition-shadow"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm uppercase">Statement Reset Day (1-31)</label>
            <input
              type="number"
              required
              min="1"
              max="31"
              value={resetDay}
              onChange={e => setResetDay(e.target.value)}
              className="border-2 border-ink p-2 focus:shadow-brutal outline-none transition-shadow"
              placeholder="15"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-ink text-canvas font-black uppercase py-3 border-2 border-transparent hover:bg-canvas hover:text-ink hover:border-ink hover:shadow-brutal transition-all disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-canvas disabled:hover:border-transparent disabled:hover:shadow-none"
          >
            {loading ? 'Saving...' : 'Save Card'}
          </button>
        </form>
      </div>
    </div>
  )
}
