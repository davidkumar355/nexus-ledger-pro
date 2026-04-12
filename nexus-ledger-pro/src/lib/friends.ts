'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

export type Friend = {
  id: string
  user_id: string
  name: string
  created_at: string
}

export type FriendTransaction = {
  id: string
  friend_id: string
  user_id: string
  type: 'lent' | 'borrowed' | 'settled'
  amount: number
  note: string | null
  txn_date: string
  created_at: string
}

export type FriendWithBalance = Friend & {
  netBalance: number
  transactions: FriendTransaction[]
}

export async function getFriendsWithBalance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Fetch friends
  const { data: friends, error: friendError } = await supabase
    .from('friends')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  if (friendError) {
    console.error('Error fetching friends:', friendError)
    return []
  }

  // Fetch transactions
  const { data: transactions, error: txError } = await supabase
    .from('friend_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('txn_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (txError) {
    console.error('Error fetching friend transactions:', txError)
    return []
  }

  // Calculate balances
  const result: FriendWithBalance[] = friends.map(f => {
    const friendTxns = transactions.filter(t => t.friend_id === f.id)
    
    // Calculate gross values
    const lent = friendTxns.filter(t => t.type === 'lent').reduce((acc, t) => acc + Number(t.amount), 0)
    const borrowed = friendTxns.filter(t => t.type === 'borrowed').reduce((acc, t) => acc + Number(t.amount), 0)
    const settled = friendTxns.filter(t => t.type === 'settled').reduce((acc, t) => acc + Number(t.amount), 0)
    
    // According to plan:
    // positive = they owe you (lent - borrowed)
    // if positive, a settlement means they paid you back, so it reduces the amount they owe you.
    // if negative, a settlement means you paid them back, so it reduces the amount you owe them (adds to balance).
    let baseNet = lent - borrowed
    
    // We apply settlement as a reduction of absolute balance
    if (baseNet > 0) {
      baseNet = Math.max(0, baseNet - settled) // shouldn't go below 0 purely from settlement
    } else if (baseNet < 0) {
      baseNet = Math.min(0, baseNet + settled) // shouldn't go above 0 purely from settlement
    }
    
    return {
      ...f,
      netBalance: baseNet,
      transactions: friendTxns
    }
  })

  // Sort by highest absolute balance
  return result.sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance))
}

export async function addFriend(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('friends')
    .insert([{ user_id: user.id, name }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Friend
}

export async function addIouTransaction(data: { friend_id: string, type: 'lent' | 'borrowed' | 'settled', amount: number, note?: string, txn_date: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('friend_transactions')
    .insert([{
      user_id: user.id,
      friend_id: data.friend_id,
      type: data.type,
      amount: data.amount,
      note: data.note || null,
      txn_date: data.txn_date
    }])

  if (error) throw new Error(error.message)
  revalidatePath('/friends')
}

export async function deleteFriendTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('friend_transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/friends')
}
