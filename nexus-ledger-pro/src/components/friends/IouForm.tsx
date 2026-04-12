'use client'

import { useState } from 'react'
import { addIouTransaction, addFriend } from '@/lib/friends'
import type { FriendWithBalance } from '@/lib/friends'
import { Plus } from 'lucide-react'

type Props = {
  friends: FriendWithBalance[]
}

export default function IouForm({ friends }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isNewFriend, setIsNewFriend] = useState(false)
  
  const [formData, setFormData] = useState({
    friend_id: friends.length > 0 ? friends[0].id : '',
    new_friend_name: '',
    type: 'lent' as 'lent' | 'borrowed' | 'settled',
    amount: '',
    note: '',
    txn_date: new Date().toISOString().split('T')[0],
  })

  // Ensure friend_id is selected if friends exist and none is selected
  if (!isNewFriend && !formData.friend_id && friends.length > 0) {
    setFormData({ ...formData, friend_id: friends[0].id })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalFriendId = formData.friend_id

      if (isNewFriend || friends.length === 0) {
        if (!formData.new_friend_name) {
          alert('Friend name is required')
          setLoading(false)
          return
        }
        const newFriend = await addFriend(formData.new_friend_name)
        finalFriendId = newFriend.id
      }

      await addIouTransaction({
        friend_id: finalFriendId,
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
        className="fixed bottom-8 right-8 w-16 h-16 bg-canvas border-4 border-ink shadow-brutal active:translate-y-1 active:shadow-none transition-all flex items-center justify-center rounded-full z-50 hover:bg-[#FFE81A]"
        title="Add IOU"
      >
        <Plus className="w-8 h-8" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-canvas border-4 border-ink shadow-brutal p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-black uppercase">New Transaction</h2>
          <button type="button" onClick={() => setIsOpen(false)} className="text-ink hover:underline font-bold">
            Close
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-black uppercase text-sm">Friend</label>
            {friends.length > 0 && (
              <button 
                type="button" 
                onClick={() => setIsNewFriend(!isNewFriend)}
                className="text-xs font-bold underline hover:text-[#525CEB]"
              >
                {isNewFriend ? 'Select existing' : 'Add new friend'}
              </button>
            )}
          </div>
          
          {isNewFriend || friends.length === 0 ? (
            <input
              required
              type="text"
              value={formData.new_friend_name}
              onChange={(e) => setFormData({ ...formData, new_friend_name: e.target.value })}
              className="w-full p-3 bg-white border-4 border-ink font-bold focus:outline-none focus:ring-0"
              placeholder="Friend's Name"
            />
          ) : (
            <select
              value={formData.friend_id}
              onChange={(e) => setFormData({ ...formData, friend_id: e.target.value })}
              className="w-full p-3 bg-white border-4 border-ink font-bold focus:outline-none focus:ring-0 appearance-none rounded-none"
            >
              {friends.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block font-black uppercase text-sm mb-1">Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'lent' })}
              className={`p-2 border-4 border-ink font-black uppercase text-sm transition-colors ${
                formData.type === 'lent' ? 'bg-success text-white' : 'bg-white hover:bg-gray-100'
              }`}
            >
              Lent
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'borrowed' })}
              className={`p-2 border-4 border-ink font-black uppercase text-sm transition-colors ${
                formData.type === 'borrowed' ? 'bg-danger text-white' : 'bg-white hover:bg-gray-100'
              }`}
            >
              Borrowed
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'settled' })}
              className={`p-2 border-4 border-ink font-black uppercase text-sm transition-colors ${
                formData.type === 'settled' ? 'bg-[#FFE81A] text-ink' : 'bg-white hover:bg-gray-100'
              }`}
            >
              Settled
            </button>
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
            placeholder="e.g. Dinner, Movie tickets"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 bg-ink border-4 border-ink shadow-brutal active:translate-y-1 active:shadow-none transition-all font-black uppercase text-white hover:text-[#FFE81A] disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  )
}
