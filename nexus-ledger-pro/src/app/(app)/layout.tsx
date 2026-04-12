import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import { checkAndResetCards } from '@/lib/reset'
import QuickEntryFAB from '@/components/QuickEntry/QuickEntryFAB'
import { getCards } from '@/lib/cards'
import { getFriendsWithBalance } from '@/lib/friends'

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

  // Idempotent auto-reset check for credit card statements
  await checkAndResetCards(user.id)
  
  const [cards, friends] = await Promise.all([
    getCards(),
    getFriendsWithBalance()
  ])

  return (
    <div className="min-h-screen bg-canvas">
      <Nav email={user.email ?? ''} />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-28">
        {children}
      </main>
      
      <QuickEntryFAB 
        options={{
          cards: cards.map(c => ({ id: c.id, name: c.name })),
          friends: friends.map(f => ({ id: f.id, name: f.name }))
        }} 
      />
    </div>
  )
}
