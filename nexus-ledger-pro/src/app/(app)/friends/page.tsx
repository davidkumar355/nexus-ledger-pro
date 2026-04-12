import { getFriendsWithBalance } from '@/lib/friends'
import FriendCard from '@/components/friends/FriendCard'
import IouForm from '@/components/friends/IouForm'

export default async function FriendsPage() {
  const friends = await getFriendsWithBalance()

  const totalOwedToYou = friends.reduce((sum, f) => sum + (f.netBalance > 0 ? f.netBalance : 0), 0)
  const totalYouOwe = friends.reduce((sum, f) => sum + (f.netBalance < 0 ? Math.abs(f.netBalance) : 0), 0)

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 w-full relative min-h-screen pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase text-ink">Friend IOUs</h1>
        <p className="font-bold text-gray-700">Track who owes you and what you owe.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-canvas border-4 border-ink shadow-brutal p-4">
          <div className="font-black uppercase text-sm mb-1 text-gray-500">Total Owed To You</div>
          <div className="text-2xl font-black text-green-600">+{formatINR(totalOwedToYou)}</div>
        </div>
        <div className="bg-canvas border-4 border-ink shadow-brutal p-4">
          <div className="font-black uppercase text-sm mb-1 text-gray-500">Total You Owe</div>
          <div className="text-2xl font-black text-red-600">-{formatINR(totalYouOwe)}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {friends.length === 0 ? (
          <div className="p-8 border-4 border-ink bg-white text-center font-black uppercase text-gray-500">
            No friends tracked yet. Click the + button to add one!
          </div>
        ) : (
          friends.map((friend) => (
            <FriendCard key={friend.id} friendData={friend} />
          ))
        )}
      </div>

      <IouForm friends={friends} />
    </div>
  )
}
