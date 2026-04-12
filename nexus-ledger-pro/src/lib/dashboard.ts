'use server'

import { createClient } from './supabase/server'
import { getFriendsWithBalance } from './friends'
import { getCards } from './cards'

export type DashboardStats = {
  totalCreditAvailable: number
  totalNetFriendBalance: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [cards, friends] = await Promise.all([
    getCards(),
    getFriendsWithBalance()
  ])

  let totalCreditAvailable = 0
  for (const card of cards) {
    const available = Number(card.total_limit) - Number(card.spent)
    totalCreditAvailable += available > 0 ? available : 0
  }

  let totalNetFriendBalance = 0
  for (const friend of friends) {
    totalNetFriendBalance += friend.netBalance
  }

  return {
    totalCreditAvailable,
    totalNetFriendBalance
  }
}
