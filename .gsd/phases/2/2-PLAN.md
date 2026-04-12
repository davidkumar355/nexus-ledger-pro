---
phase: 2
plan: 2
wave: 1
---

# Plan 2.2: Statement Auto-Reset Logic

## Objective
Implement the idempotent statement reset — when today's date matches a card's reset_day AND the current month differs from last_reset_month, archive spent amount to cc_history and reset spent to 0.

## Context
- `.gsd/SPEC.md`
- `.gsd/phases/2/1-PLAN.md`
- `src/lib/cards.ts`

## Tasks

<task type="auto">
  <name>Reset logic function + trigger on app load</name>
  <files>src/lib/reset.ts, src/app/(app)/layout.tsx</files>
  <action>
    Create `src/lib/reset.ts` with `checkAndResetCards(userId: string)`:

    ```ts
    // Idempotent: safe to call multiple times per day
    export async function checkAndResetCards(userId: string) {
      const supabase = createClient() // server client
      const today = new Date()
      const todayDay = today.getDate()
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

      // Fetch cards where reset_day == today AND last_reset_month != currentMonth
      const { data: cards } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('user_id', userId)
        .eq('reset_day', todayDay)
        .neq('last_reset_month', currentMonth)

      for (const card of cards ?? []) {
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
    ```

    Call `checkAndResetCards(user.id)` in `(app)/layout.tsx` server component on every render.
    This is safe because the neq('last_reset_month', currentMonth) guard makes it idempotent.
  </action>
  <verify>Test-Path "src/lib/reset.ts"</verify>
  <done>Reset function exists; layout calls it; running twice on reset day does NOT double-archive</done>
</task>

<task type="auto">
  <name>Add "Log Spend" quick action on cards</name>
  <files>src/components/cards/LogSpendButton.tsx, src/lib/cards.ts</files>
  <action>
    Add `logSpend(cardId, amount)` to `cards.ts` — does:
    ```sql
    UPDATE credit_cards SET spent = spent + amount WHERE id = cardId
    ```

    `LogSpendButton.tsx` — small inline form next to each card:
    - Amount input (number, placeholder "₹ Amount")
    - "Log" button (bg-warning border-brutal)
    - On submit: calls logSpend, refreshes page with router.refresh()

    This allows quick spend entry directly on the card without opening full edit form.
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>Log Spend button adds to spent; card available balance updates immediately</done>
</task>

## Success Criteria
- [ ] `checkAndResetCards` archives spent and resets on the correct day
- [ ] Calling reset twice same day does NOT create duplicate history entries
- [ ] "Log Spend" quick action works on cards page
- [ ] Last reset month stored correctly as 'YYYY-MM'
