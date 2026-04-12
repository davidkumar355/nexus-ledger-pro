'use client'

import { useState } from 'react'
import type { CreditCard } from '@/lib/cards'
import { deleteCard } from '@/lib/cards'
import { inr } from '@/lib/format'
import LogSpendButton from './LogSpendButton'
import CardForm from './CardForm'
import { Pencil, Trash2 } from 'lucide-react'

export default function CardGrid({ cards }: { cards: CreditCard[] }) {
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteCard(id)
      } catch (err) {
        console.error(err)
        alert('Failed to delete card')
      }
    }
  }

  if (cards.length === 0) {
    return (
      <div className="border-4 border-ink border-dashed p-8 text-center bg-canvas">
        <p className="font-bold text-lg uppercase">No credit cards found</p>
        <p className="text-sm mt-2">Add your first credit card to start tracking.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => {
          const available = card.total_limit - card.spent
          const isDanger = available < 0

          return (
            <div key={card.id} className="card-brutal flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black uppercase break-words pr-2">{card.name}</h3>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => setEditingCard(card)}
                      className="p-2 border-2 border-ink hover:bg-ink hover:text-canvas transition-colors"
                      title="Edit Card"
                    >
                      <Pencil size={16} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => handleDelete(card.id, card.name)}
                      className="p-2 border-2 border-ink bg-danger text-ink hover:brightness-90 transition-all"
                      title="Delete Card"
                    >
                      <Trash2 size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-ink text-canvas px-2 py-1 text-xs font-bold uppercase border-2 border-transparent">
                    Resets Day {card.reset_day}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">Spent:</span>
                    <span className="font-bold">{inr(card.spent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">Limit:</span>
                    <span className="font-bold">{inr(card.total_limit)}</span>
                  </div>
                  
                  <div className="h-0.5 bg-ink w-full my-4"></div>
                  
                  <div className="flex justify-between items-end">
                    <span className="font-black uppercase text-sm">Available:</span>
                    <span className={`text-xl font-black px-2 py-1 border-2 border-ink ${isDanger ? 'bg-danger text-ink' : 'bg-success text-ink'}`}>
                      {inr(available)}
                    </span>
                  </div>
                </div>
              </div>

              <LogSpendButton cardId={card.id} />
            </div>
          )
        })}
      </div>

      {editingCard && (
        <CardForm 
          initialData={editingCard} 
          onClose={() => setEditingCard(null)} 
        />
      )}
    </>
  )
}
