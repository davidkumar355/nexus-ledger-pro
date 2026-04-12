'use client'

import { useState } from 'react'
import CardForm from './CardForm'

export default function AddCardButton() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-success text-ink border-2 border-ink font-black uppercase px-6 py-2 shadow-brutal hover:bg-success/80 active:translate-y-1 active:shadow-none transition-all"
      >
        + Add Card
      </button>
      
      {showForm && (
        <CardForm onClose={() => setShowForm(false)} />
      )}
    </>
  )
}
