'use client'

import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    // Import lazily so Supabase client is only created on user action
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for the magic link!')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-10 text-center">
          <div className="inline-block border-[3px] border-canvas px-3 py-1 mb-4">
            <span className="text-canvas font-black text-xs tracking-[0.3em] uppercase">NLP</span>
          </div>
          <h1 className="text-canvas font-black text-4xl uppercase tracking-tight leading-none">
            Nexus<br />Ledger<br />Pro
          </h1>
          <p className="text-canvas/50 text-sm mt-3 font-medium">
            Private cloud-synced finance orchestrator
          </p>
        </div>

        {/* Login card */}
        <div className="card-brutal bg-canvas p-6">
          <p className="font-bold text-sm text-ink/60 uppercase tracking-wider mb-4">
            Sign In Securely
          </p>
          <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-white border-2 border-ink text-ink font-mono focus:outline-none focus:ring-4 focus:ring-ink/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-brutal w-full bg-ink text-canvas py-4 px-6 text-base font-black uppercase tracking-wide flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center font-bold text-sm text-ink">
              {message}
            </p>
          )}
        </div>

        <p className="text-canvas/30 text-xs text-center mt-6">
          Passwordless & secure. Access is restricted using magic links.
        </p>
      </div>
    </main>
  )
}
