'use server'

import { createClient } from './supabase/server'

export type JournalEntry = {
  id: string
  type: 'bank' | 'iou' | 'cc_reset'
  date: string
  amount: number
  description: string
  sourceOrName: string
}

export async function getAllTransactions(): Promise<JournalEntry[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const entries: JournalEntry[] = []

  // 1. Fetch bank transactions
  const { data: bankTxns } = await supabase
    .from('bank_transactions')
    .select('*')
    .eq('user_id', user.id)
  
  if (bankTxns) {
    for (const txn of bankTxns) {
      entries.push({
        id: `bank_${txn.id}`,
        type: 'bank',
        date: txn.txn_date,
        // For bank transactions, amount represents credit (positive) or debit (negative)
        amount: txn.type === 'debit' ? -Number(txn.amount) : Number(txn.amount),
        description: txn.note || 'Bank Transaction',
        sourceOrName: txn.source
      })
    }
  }

  // 2. Fetch friend transactions
  const { data: friendTxns } = await supabase
    .from('friend_transactions')
    .select('*, friends(name)')
    .eq('user_id', user.id)

  if (friendTxns) {
    for (const txn of friendTxns) {
      const friendName = txn.friends?.name || 'Unknown'
      
      let amount = Number(txn.amount)
      let desc = ''
      
      if (txn.type === 'lent') {
        amount = amount // Lent money (friend owes you, but technically cash left your pocket. Actually wait. LENT means you lent money to them.
        desc = `Lent to friend`
      } else if (txn.type === 'borrowed') {
        amount = -amount
        desc = `Borrowed from friend`
      } else if (txn.type === 'settled') {
        // Settled could be either way. We can just keep it as positive or note it. Let's make it positive by default.
        desc = `Settlement`
      }
      
      entries.push({
        id: `iou_${txn.id}`,
        type: 'iou',
        date: txn.txn_date,
        amount: amount,
        description: txn.note ? `${desc}: ${txn.note}` : desc,
        sourceOrName: friendName
      })
    }
  }

  // 3. Fetch CC resets
  const { data: ccHistory } = await supabase
    .from('cc_history')
    .select('*, credit_cards(name)')
    .eq('user_id', user.id)

  if (ccHistory) {
    for (const history of ccHistory) {
      entries.push({
        id: `cc_${history.id}`,
        type: 'cc_reset',
        date: history.cycle_month + '-01', // proxy for date
        amount: -Number(history.spent), // Spent limits represent money you "owe" or paid
        description: `Statement Balance Saved`,
        sourceOrName: history.credit_cards?.name || 'Unknown Card'
      })
    }
  }

  // Sort by date DESC
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
