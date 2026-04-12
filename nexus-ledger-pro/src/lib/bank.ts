'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

export type BankTransaction = {
  id: string
  user_id: string
  source: string
  type: 'credit' | 'debit'
  amount: number
  note: string | null
  txn_date: string
  created_at: string
}

export async function getBankTransactions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('bank_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('txn_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bank transactions:', error)
    return []
  }

  return data as BankTransaction[]
}

export async function addBankTransaction(data: { source: string, type: 'credit' | 'debit', amount: number, note?: string, txn_date: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('bank_transactions')
    .insert([
      {
        user_id: user.id,
        source: data.source,
        type: data.type,
        amount: data.amount,
        note: data.note || null,
        txn_date: data.txn_date,
      }
    ])

  if (error) throw new Error(error.message)
  
  revalidatePath('/bank')
}

export async function deleteBankTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('bank_transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/bank')
}
