'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

export type CreditCard = {
  id: string
  user_id: string
  name: string
  total_limit: number
  spent: number
  reset_day: number
  last_reset_month: string | null
  created_at: string
}

export async function getCards() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cards:', error)
    return []
  }

  return data as CreditCard[]
}

export async function createCard(data: { name: string, total_limit: number, spent: number, reset_day: number }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('credit_cards')
    .insert([
      {
        user_id: user.id,
        name: data.name,
        total_limit: data.total_limit,
        spent: data.spent,
        reset_day: data.reset_day,
      }
    ])

  if (error) return { error: error.message }
  
  revalidatePath('/cards')
  return { success: true }
}

export async function updateCard(id: string, data: Partial<{ name: string, total_limit: number, spent: number, reset_day: number }>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('credit_cards')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/cards')
  return { success: true }
}

export async function deleteCard(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('credit_cards')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/cards')
}

export async function logSpend(cardId: string, amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // To increment safely without race conditions in PostgreSQL, we normally use an RPC or raw SQL.
  // Since we're using simple supabase bindings, let's fetch first then increment, or better, use an RPC later.
  // Given standard constraints, let's just fetch and update for the MVP.
  const { data: card } = await supabase
    .from('credit_cards')
    .select('spent')
    .eq('id', cardId)
    .eq('user_id', user.id)
    .single()

  if (!card) throw new Error('Card not found')

  const { error } = await supabase
    .from('credit_cards')
    .update({ spent: card.spent + amount })
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/cards')
}
