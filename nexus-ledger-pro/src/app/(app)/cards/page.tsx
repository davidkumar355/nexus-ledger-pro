import { getCards } from '@/lib/cards'
import CardGrid from '@/components/cards/CardGrid'
import AddCardButton from '@/components/cards/AddCardButton'

export const metadata = {
  title: 'Credit Cards | Nexus Ledger Pro'
}

export default async function CardsPage() {
  const cards = await getCards()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-1">Credit Cards</h1>
          <p className="font-medium text-lg">Manage limits, track spends, auto-reset statements.</p>
        </div>
        
        <AddCardButton />
      </div>

      <CardGrid cards={cards} />
    </div>
  )
}
