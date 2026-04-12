'use client'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    // Import lazily so Supabase client is only created on user action
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
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
            Owner Access Only
          </p>
          <button
            onClick={handleGoogleLogin}
            className="btn-brutal w-full bg-ink text-canvas py-4 px-6 text-base font-black uppercase tracking-wide flex items-center justify-center gap-3"
          >
            {/* Google icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-canvas/30 text-xs text-center mt-6">
          Access restricted to authorised owner
        </p>
      </div>
    </main>
  )
}


