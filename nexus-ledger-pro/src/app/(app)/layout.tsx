import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Nav email={user.email ?? ''} />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-28">
        {children}
      </main>
    </div>
  )
}
