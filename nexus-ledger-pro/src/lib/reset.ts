'use server'

import { createClient } from './supabase/server'

// Idempotent: safe to call multiple times per day
export async function checkAndResetCards(userId: string) {
  const supabase = await createClient()
  const today = new Date()
  const todayDay = today.getDate()
  // format YYYY-MM
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  // Fetch cards where reset_day == todayDay AND (last_reset_month is null or last_reset_month != currentMonth)
  const { data: cards, error } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', userId)
    .eq('reset_day', todayDay)
    
  if (error || !cards) return;

  const toReset = cards.filter((c: any) => c.last_reset_month !== currentMonth)

  for (const card of toReset) {
    // Archive current spent
    await supabase.from('cc_history').insert({
      card_id: card.id,
      user_id: userId,
      cycle_month: currentMonth,
      spent: card.spent,
    })
    
    // Reset spent + mark month
    await supabase
      .from('credit_cards')
      .update({ spent: 0, last_reset_month: currentMonth })
      .eq('id', card.id)
  }
}
