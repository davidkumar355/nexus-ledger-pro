---
phase: 3
plan: 2
wave: 1
---

# Plan 3.2: Friend IOU Tracker

## Objective
Build the Friend IOU tracker — a ledger for personal lending and borrowing, with a per-friend running net balance (positive = you are owed money, negative = you owe money).

## Context
- `.gsd/SPEC.md`
- `.gsd/phases/3/1-PLAN.md`

## Tasks

<task type="auto">
  <name>Supabase schema — friends + friend_transactions tables</name>
  <files>supabase/migrations/003_iou.sql</files>
  <action>
    ```sql
    CREATE TABLE friends (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL DEFAULT auth.uid(),
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE friend_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      friend_id UUID REFERENCES friends(id) ON DELETE CASCADE,
      user_id UUID NOT NULL DEFAULT auth.uid(),
      type TEXT NOT NULL CHECK (type IN ('lent', 'borrowed', 'settled')),
      amount NUMERIC(12,2) NOT NULL,
      note TEXT,
      txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
    ALTER TABLE friend_transactions ENABLE ROW LEVEL SECURITY;
    ```

    Net balance formula per friend:
    - SUM(amount) WHERE type='lent' → you gave them money (positive)
    - SUM(amount) WHERE type='borrowed' → they gave you money (negative)
    - SUM(amount) WHERE type='settled' → reduces balance
    Final net = lent_total - borrowed_total - settled_total
  </action>
  <verify>Test-Path "supabase/migrations/003_iou.sql"</verify>
  <done>Migration file exists; tables created in Supabase</done>
</task>

<task type="auto">
  <name>Friend IOU UI — friend list with net balances + transaction log</name>
  <files>src/app/(app)/friends/page.tsx, src/components/friends/FriendCard.tsx, src/components/friends/IouForm.tsx, src/lib/friends.ts</files>
  <action>
    `src/lib/friends.ts`:
    - `getFriendsWithBalance()` → joins friends + friend_transactions, computes net per friend
    - `addFriend(name)` → INSERT into friends
    - `addIouTransaction(data)` → INSERT into friend_transactions
    - `deleteFriendTransaction(id)` → DELETE

    `FriendCard.tsx` — one card per friend:
    - Friend name in bold
    - Net balance: large number, success green if positive (they owe you), danger red if negative (you owe them)
    - Label: "Owes you" or "You owe" based on sign
    - Transaction history below (collapsed by default, expand on click): date | type chip | amount | note
    - "Add Transaction" button opens IouForm pre-filled with this friend

    `IouForm.tsx`:
    - Friend selector (dropdown from existing friends, or "New Friend" input)
    - Type: Lent / Borrowed / Settled (3 brutalist toggle buttons bg-success/bg-danger/bg-warning)
    - Amount (number) + Note (text) + Date

    `friends/page.tsx`:
    - Total net summary at top: "Net across all friends: ₹X" (positive/negative colored)
    - List of FriendCards sorted by absolute balance (largest first)
    - "Add IOU" FAB button
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>Friends page shows per-friend net balance; lent/borrowed/settled types calc correctly</done>
</task>

## Success Criteria
- [ ] friends and friend_transactions tables exist
- [ ] Net balance per friend calculated correctly (lent - borrowed - settled)
- [ ] Positive balance = they owe you (green), negative = you owe (red)
- [ ] Transaction history expandable per friend
- [ ] All amounts in Indian format
