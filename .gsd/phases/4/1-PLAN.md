---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Journal Tab + Mini Dashboard Stats

## Objective
Build the global Journal view that shows every transaction ever (CC spends, bank, IOU) merged and sorted by date newest-first. Build the mini dashboard with "Total Credit Available" and "Total Net Debt/Credit" brutalist stat cards.

## Context
- `.gsd/SPEC.md`
- `src/lib/cards.ts`, `src/lib/bank.ts`, `src/lib/friends.ts`

## Tasks

<task type="auto">
  <name>Journal page — merged transaction feed</name>
  <files>src/app/(app)/journal/page.tsx, src/components/journal/JournalRow.tsx, src/lib/journal.ts</files>
  <action>
    `src/lib/journal.ts` — `getAllTransactions(userId)`:
    - Fetch from bank_transactions → map to `{ type: 'bank', source, amount, note, date }`
    - Fetch from friend_transactions (join friends) → map to `{ type: 'iou', friend_name, iou_type, amount, note, date }`
    - Fetch from cc_history (join credit_cards) → map to `{ type: 'cc_reset', card_name, spent, cycle_month }`
    - Merge all arrays, sort by date DESC

    `JournalRow.tsx` — single transaction row:
    - Left: type badge chip (BANK/IOU/CC-RESET) with appropriate color (bank=ink, iou=warning, cc=danger)
    - Center: note/description + source/friend/card name
    - Right: amount in INR format, +/- signed, colored
    - Thin bottom border (1px) between rows, no shadows (table-like density)

    `journal/page.tsx`:
    - Full-width table-style layout (no cards, dense rows)
    - Header row: Date | Type | Description | Amount
    - Uses JournalRow for each transaction
    - "No transactions yet" empty state if empty
    - NO graphs, NO charts — pure ledger
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>Journal shows all transaction types merged; sorted newest-first; no charts</done>
</task>

<task type="auto">
  <name>Mini dashboard — brutalist stat cards</name>
  <files>src/app/(app)/page.tsx, src/components/dashboard/StatCard.tsx, src/lib/dashboard.ts</files>
  <action>
    `src/lib/dashboard.ts` — `getDashboardStats(userId)`:
    - `totalCreditAvailable` = SUM(total_limit - spent) across all credit_cards
    - `totalNetFriendBalance` = SUM of all per-friend net balances (positive = owed to you)

    `StatCard.tsx` — large brutalist stat block:
    ```
    ┌─────────────────────────────┐  ← border-brutal shadow-brutal
    │ TOTAL CREDIT AVAILABLE      │
    │ ₹4,23,500.00                │  ← text-4xl font-black
    └─────────────────────────────┘
    ```
    Props: label (string), value (INR string), color (canvas|success|danger|warning)

    `page.tsx` (dashboard):
    - 2-column grid on desktop, stacked on mobile
    - StatCard 1: "TOTAL CREDIT AVAILABLE" — success green background if > 0
    - StatCard 2: "NET FRIEND BALANCE" — success if > 0 (owed to you), danger if < 0 (you owe)
    - Below stats: recent 5 journal entries as preview rows with "View All →" link
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>Dashboard renders 2 stat cards with correct calculations; recent journal preview shows</done>
</task>

## Success Criteria
- [ ] Journal tab shows ALL transactions (bank + IOU + CC resets) newest first
- [ ] No graphs in journal — pure row-based ledger
- [ ] Dashboard shows Total Credit Available correctly
- [ ] Dashboard Net Friend Balance positive=green, negative=red
