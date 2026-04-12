export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="card-brutal p-10 max-w-sm w-full text-center">
        <div
          className="inline-block border-[3px] border-ink px-3 py-1 mb-6"
          style={{ backgroundColor: '#FF3D00' }}
        >
          <span className="font-black text-xs tracking-[0.3em] uppercase text-canvas">
            RESTRICTED
          </span>
        </div>
        <h1 className="font-black text-3xl uppercase leading-tight mb-4">
          Access<br />Denied
        </h1>
        <p className="text-ink/60 font-medium mb-8">
          This ledger is private. You are not authorised to access this system.
        </p>
        <a
          href="/login"
          className="btn-brutal inline-block bg-ink text-canvas px-6 py-3 font-black uppercase text-sm tracking-wide"
        >
          Back to Login
        </a>
      </div>
    </main>
  )
}
