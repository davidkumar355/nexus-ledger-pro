'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logSpend } from '@/lib/cards'
import { addBankTransaction } from '@/lib/bank'
import { addIouTransaction } from '@/lib/friends'

type Options = {
  cards: { id: string, name: string }[]
  friends: { id: string, name: string }[]
}

type Props = {
  options: Options
  onClose: () => void
}

export default function QuickEntryModal({ options, onClose }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'CC' | 'BANK' | 'FRIEND'>('CC')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  
  // Specific states
  const [cardId, setCardId] = useState(options.cards[0]?.id || '')
  
  const [bankSource, setBankSource] = useState('')
  const [bankType, setBankType] = useState<'credit' | 'debit'>('debit')
  
  const [friendId, setFriendId] = useState(options.friends[0]?.id || '')
  const [friendType, setFriendType] = useState<'lent' | 'borrowed' | 'settled'>('lent')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const txn_date = new Date().toISOString()
      
      if (tab === 'CC') {
        if (!cardId) throw new Error('No card selected')
        await logSpend(cardId, Number(amount))
      } else if (tab === 'BANK') {
        if (!bankSource) throw new Error('Source/Vendor is required')
        await addBankTransaction({
          source: bankSource,
          amount: Number(amount),
          type: bankType,
          note,
          txn_date
        })
      } else if (tab === 'FRIEND') {
        if (!friendId) throw new Error('No friend selected')
        await addIouTransaction({
          friend_id: friendId,
          amount: Number(amount),
          type: friendType,
          note,
          txn_date
        })
      }
      
      router.refresh()
      onClose()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-canvas border-t-4 sm:border-4 border-ink shadow-brutal max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-none">
        <div className="flex border-b-4 border-ink bg-white sticky top-0 z-10">
          <button 
            type="button"
            className={`flex-1 py-4 font-black uppercase text-sm border-r-4 border-ink ${tab === 'CC' ? 'bg-danger text-white' : 'hover:bg-warning'}`}
            onClick={() => setTab('CC')}
          >
            💳 Card
          </button>
          <button 
            type="button"
            className={`flex-1 py-4 font-black uppercase text-sm border-r-4 border-ink ${tab === 'BANK' ? 'bg-ink text-white' : 'hover:bg-warning'}`}
            onClick={() => setTab('BANK')}
          >
            🏦 Bank
          </button>
          <button 
            type="button"
            className={`flex-1 py-4 font-black uppercase text-sm ${tab === 'FRIEND' ? 'bg-[#FFE81A] text-ink' : 'hover:bg-gray-100'}`}
            onClick={() => setTab('FRIEND')}
          >
            🤝 Friend
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pb-8 space-y-6">
          
          <div className="space-y-2">
            <label className="block font-black uppercase text-sm">Amount (₹)</label>
            <input 
              required
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-2xl font-black p-4 border-4 border-ink focus:outline-none focus:bg-warning/20 transition-colors"
              placeholder="0.00"
            />
          </div>

          {tab === 'CC' && (
            <div className="space-y-2">
              <label className="block font-black uppercase text-sm">Select Card</label>
              <select 
                required
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                className="w-full font-bold p-4 border-4 border-ink focus:outline-none focus:bg-warning/20 appearance-none bg-white font-mono"
              >
                {options.cards.length === 0 && <option value="">No cards available</option>}
                {options.cards.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {tab === 'BANK' && (
            <>
              <div className="space-y-2">
                <label className="block font-black uppercase text-sm">Type</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer relative">
                    <input type="radio" name="bank_type" value="debit" checked={bankType === 'debit'} onChange={() => setBankType('debit')} className="peer sr-only" />
                    <div className="border-4 border-ink p-3 text-center font-black uppercase peer-checked:bg-danger peer-checked:text-white hover:bg-gray-100">Debit (Lost)</div>
                  </label>
                  <label className="flex-1 cursor-pointer relative">
                    <input type="radio" name="bank_type" value="credit" checked={bankType === 'credit'} onChange={() => setBankType('credit')} className="peer sr-only" />
                    <div className="border-4 border-ink p-3 text-center font-black uppercase peer-checked:bg-success peer-checked:text-ink hover:bg-gray-100">Credit (Got)</div>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-black uppercase text-sm">Source / Vendor</label>
                <input 
                  required
                  type="text"
                  value={bankSource}
                  onChange={(e) => setBankSource(e.target.value)}
                  className="w-full font-bold p-4 border-4 border-ink focus:outline-none focus:bg-warning/20"
                  placeholder="e.g. Swiggy, Salary, ATM"
                />
              </div>
            </>
          )}

          {tab === 'FRIEND' && (
            <>
              <div className="space-y-2">
                <label className="block font-black uppercase text-sm">Select Friend</label>
                <select 
                  required
                  value={friendId}
                  onChange={(e) => setFriendId(e.target.value)}
                  className="w-full font-bold p-4 border-4 border-ink focus:outline-none focus:bg-warning/20 appearance-none bg-white font-mono"
                >
                  {options.friends.length === 0 && <option value="">No friends available</option>}
                  {options.friends.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block font-black uppercase text-sm">Action Type</label>
                <select 
                  required
                  value={friendType}
                  onChange={(e) => setFriendType(e.target.value as any)}
                  className="w-full font-bold p-4 border-4 border-ink focus:outline-none focus:bg-warning/20 appearance-none bg-white"
                >
                  <option value="lent">I Lent Them Money (They Owe Me)</option>
                  <option value="borrowed">I Borrowed Money (I Owe Them)</option>
                  <option value="settled">Settled / Repaid</option>
                </select>
              </div>
            </>
          )}

          {(tab === 'BANK' || tab === 'FRIEND') && (
            <div className="space-y-2">
              <label className="block font-black uppercase text-sm text-gray-500">Note (Optional)</label>
              <input 
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full font-bold p-4 border-4 border-ink focus:outline-none focus:bg-warning/20"
                placeholder="What was this for?"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ink text-white font-black uppercase p-4 border-4 border-ink shadow-brutal hover:bg-white hover:text-ink transition-colors disabled:opacity-50 mt-4"
          >
            {isSubmitting ? 'Saving...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}
