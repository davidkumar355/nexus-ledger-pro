---
phase: 4
plan: 2
wave: 1
---

# Plan 4.2: Mobile UX — One-Handed Entry FAB

## Objective
Implement the floating "New Transaction" button visible on all pages (bottom of screen), mobile-first, that opens a unified bottom sheet / modal for quick transaction entry across all three ledgers.

## Context
- `.gsd/SPEC.md`
- All lib files: cards.ts, bank.ts, friends.ts

## Tasks

<task type="auto">
  <name>Global FAB + Quick Entry bottom sheet</name>
  <files>src/components/QuickEntry/QuickEntryFAB.tsx, src/components/QuickEntry/QuickEntryModal.tsx, src/app/(app)/layout.tsx</files>
  <action>
    `QuickEntryFAB.tsx` — fixed-position button:
    - Position: `fixed bottom-6 right-6 z-50` (or centered: `fixed bottom-6 left-1/2 -translate-x-1/2`)
    - Style: `w-16 h-16 rounded-full bg-ink border-brutal shadow-brutal` 
    - Inner: `+` icon (Lucide Plus, white, size 28)
    - On tap: opens QuickEntryModal
    - On mobile: `w-20 h-20` (larger tap target for one-handed use)

    `QuickEntryModal.tsx` — slides up from bottom:
    - Backdrop: fixed inset-0 bg-black/40
    - Sheet: slides up from bottom, max-h-[85vh] overflow-y-auto, bg-canvas border-t-brutal
    - Tab bar at top of sheet: "💳 Card" | "🏦 Bank" | "🤝 Friend" (brutalist toggle)
    - CC tab: card selector dropdown + amount field → calls logSpend()
    - Bank tab: source (text), type (credit/debit), amount, note → calls addBankTransaction()
    - Friend tab: friend selector, type (lent/borrowed/settled), amount, note → calls addIouTransaction()
    - All inputs large (h-14 text-lg) for thumb-friendly mobile entry
    - Submit button full-width at bottom (bg-ink text-canvas border-brutal h-14)
    - Close: tap backdrop or swipe down

    Add `<QuickEntryFAB />` to `(app)/layout.tsx` — renders on every page.
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>FAB visible on all app pages; modal opens with 3 tabs; each tab submits correctly</done>
</task>

<task type="auto">
  <name>Mobile responsive audit — all pages</name>
  <files>src/components/Nav.tsx, src/components/cards/CardGrid.tsx, src/app/(app)/journal/page.tsx</files>
  <action>
    Audit and fix responsive behavior:

    Nav.tsx on mobile:
    - Links collapse into a hamburger or scrollable horizontal tab bar
    - User email truncated or hidden on mobile

    CardGrid.tsx:
    - 1 column on mobile (grid-cols-1), 2 on tablet (sm:grid-cols-2), 3 on desktop (lg:grid-cols-3)

    Journal page on mobile:
    - Hide "Date" column header on mobile (it's in each row as a smaller label)
    - Rows stack: top-line = description, bottom-line = date + amount

    All touch targets ≥ 44px height.
    Test mental model: can you add a bank transaction with one thumb without zooming?
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>All pages usable on 375px viewport; FAB accessible; no horizontal scroll</done>
</task>

## Success Criteria
- [ ] FAB visible on all authenticated pages
- [ ] Quick entry modal has 3 tabs (CC / Bank / Friend)
- [ ] Each tab submits to correct table and refreshes data
- [ ] All touch targets ≥ 44px
- [ ] No horizontal overflow on 375px viewport
