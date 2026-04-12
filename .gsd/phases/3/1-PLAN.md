---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: UPI/Bank Ledger

## Objective
Build the bank/UPI transaction ledger — track transactions per source account (SBI, Axis, etc.) with running balance display per source.

## Context
- `.gsd/SPEC.md`
- `.gsd/ROADMAP.md`

## Tasks

<task type="auto">
  <name>Supabase schema — bank_transactions table</name>
  <files>supabase/migrations/002_bank_transactions.sql</files>
  <action>
    ```sql
    CREATE TABLE bank_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL DEFAULT auth.uid(),
      source TEXT NOT NULL,       -- e.g., 'SBI', 'Axis', 'Cash'
      type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
      amount NUMERIC(12,2) NOT NULL,
      note TEXT,
      txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
    ```
  </action>
  <verify>Test-Path "supabase/migrations/002_bank_transactions.sql"</verify>
  <done>Migration file exists; table created in Supabase</done>
</task>

<task type="auto">
  <name>Bank ledger UI — grouped by source with running balance</name>
  <files>src/app/(app)/bank/page.tsx, src/components/bank/SourceGroup.tsx, src/components/bank/BankTxnForm.tsx, src/lib/bank.ts</files>
  <action>
    `src/lib/bank.ts`:
    - `getBankTransactions()` → SELECT all ordered by txn_date DESC
    - `addBankTransaction(data)` → INSERT
    - `deleteBankTransaction(id)` → DELETE

    `SourceGroup.tsx` — renders one collapsible section per unique source:
    - Header: source name + net balance (credits - debits in INR format, green if positive, red if negative)
    - Transaction rows: date | note | +/- amount (color coded)
    - Border-brutal bottom per row

    `bank/page.tsx`:
    - Fetches all transactions server-side
    - Groups by source using reduce()
    - Renders SourceGroup for each
    - "Add Transaction" button → opens BankTxnForm

    `BankTxnForm.tsx`:
    - Fields: Source (text autocomplete from existing sources), Type (credit/debit toggle), Amount, Note, Date
    - Source field: shows previous sources as quick-select chips
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>Bank page shows transactions grouped by source; running balance correct; add/delete work</done>
</task>

## Success Criteria
- [ ] bank_transactions table exists in Supabase
- [ ] Transactions grouped by source (SBI, Axis, etc.)
- [ ] Net balance per source correctly calculated
- [ ] Add and delete transactions work
- [ ] All amounts in ₹X,XX,XXX.XX format
