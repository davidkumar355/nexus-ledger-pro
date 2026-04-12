'use client'

import { useState } from 'react'
import QuickEntryModal from './QuickEntryModal'

type ItemOptions = {
  cards: { id: string, name: string }[]
  friends: { id: string, name: string }[]
}

export default function QuickEntryFAB({ options }: { options: ItemOptions }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-ink text-canvas w-16 h-16 rounded-full border-4 border-ink shadow-brutal flex items-center justify-center hover:-translate-y-1 hover:shadow-brutal active:translate-y-0 active:shadow-none transition-all"
        aria-label="New Transaction"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {isOpen && (
        <QuickEntryModal 
          options={options} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  )
}
