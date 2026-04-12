---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Credit Card Database + CRUD

## Objective
Create the Supabase schema for credit cards and history archive, then build the CRUD UI for adding/editing/deleting cards with Indian currency display.

## Context
- `.gsd/SPEC.md`
- `.gsd/ROADMAP.md`

## Tasks

<task type="auto">
  <name>Supabase schema — credit_cards + cc_history tables</name>
  <files>supabase/migrations/001_credit_cards.sql</files>
  <action>
    Create migration file with this SQL (run manually in Supabase SQL editor):

    ```sql
    -- Credit cards master table
    CREATE TABLE credit_cards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL DEFAULT auth.uid(),
      name TEXT NOT NULL,
      total_limit NUMERIC(12,2) NOT NULL,
      spent NUMERIC(12,2) NOT NULL DEFAULT 0,
      reset_day INTEGER NOT NULL CHECK (reset_day BETWEEN 1 AND 31),
      last_reset_month TEXT, -- stored as 'YYYY-MM' for idempotency
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- History archive (one row per monthly cycle)
    CREATE TABLE cc_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      card_id UUID REFERENCES credit_cards(id) ON DELETE CASCADE,
      user_id UUID NOT NULL DEFAULT auth.uid(),
      cycle_month TEXT NOT NULL, -- 'YYYY-MM'
      spent NUMERIC(12,2) NOT NULL,
      archived_at TIMESTAMPTZ DEFAULT now()
    );

    -- RLS (enable in phase 5 — keep open for dev)
    ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
    ALTER TABLE cc_history ENABLE ROW LEVEL SECURITY;
    ```

    Document the SQL in the migration file so it can be re-run later.
  </action>
  <verify>Test-Path "supabase/migrations/001_credit_cards.sql"</verify>
  <done>Migration file exists; tables created in Supabase dashboard</done>
</task>

<task type="auto">
  <name>Credit card CRUD UI — card list + add/edit form</name>
  <files>src/app/(app)/cards/page.tsx, src/components/cards/CardGrid.tsx, src/components/cards/CardForm.tsx, src/lib/cards.ts</files>
  <action>
    `src/lib/cards.ts` — server actions / data fetchers:
    - `getCards()` → SELECT all from credit_cards WHERE user_id = auth.uid()
    - `createCard(data)` → INSERT
    - `updateCard(id, data)` → UPDATE
    - `deleteCard(id)` → DELETE

    `CardGrid.tsx` — renders one brutalist card per credit card:
    - Name in bold uppercase
    - ₹spent / ₹limit (both formatted with Intl.NumberFormat('en-IN'))
    - Available = limit - spent, shown in success green if > 0, danger red if < 0
    - Reset day badge: "Resets day 15"
    - Edit button (pencil icon) + Delete button (trash icon, danger red)

    `CardForm.tsx` — modal/slide-up form:
    - Fields: Card Name (text), Total Limit (number), Spent (number), Reset Day (1-31)
    - All inputs: border-brutal bg-canvas focus:shadow-brutal transition
    - Submit: "Save Card" brutalist button (bg-ink text-canvas)

    `cards/page.tsx` — fetches cards server-side, renders CardGrid + "Add Card" button (top right, bg-success)

    Currency helper in `src/lib/format.ts`:
    ```ts
    export const inr = (n: number) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)
    ```
  </action>
  <verify>npm run build 2>&1 | tail -10</verify>
  <done>Cards page renders; add/edit/delete work; amounts show in ₹X,XX,XXX.XX format</done>
</task>

## Success Criteria
- [ ] `credit_cards` and `cc_history` tables exist in Supabase
- [ ] Can add a new card with all fields
- [ ] Card displays available balance in Indian rupee format
- [ ] Edit and delete work correctly
