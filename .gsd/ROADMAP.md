# ROADMAP.md

> **Current Phase**: Not Started
> **Milestone**: v1.0 — Nexus Ledger Pro

## Must-Haves (from SPEC)
- [ ] Google OAuth restricted to owner email
- [ ] Credit cards with automatic monthly reset
- [ ] UPI/Bank ledger per source account
- [ ] Friend IOU tracker with net balance
- [ ] Full immutable journal tab
- [ ] Indian currency format everywhere
- [ ] Mini dashboard with key stats
- [ ] Mobile-first "New Transaction" CTA

---

## Phases

### Phase 1: Project Foundation + Auth
**Status**: ⬜ Not Started
**Objective**: Scaffold Next.js project, configure Tailwind Neo-Brutalist tokens, set up Supabase project, implement Google OAuth with email restriction, and create the base layout shell.
**Deliverables**:
- Next.js App Router project running locally
- Tailwind config with brutalist design tokens
- Supabase client configured
- Google OAuth login page
- Email allowlist middleware (blocks non-owner)
- Base layout: nav shell, page container
**Requirements**: Auth gate, design tokens, project foundation

### Phase 2: Credit Card System
**Status**: ⬜ Not Started
**Objective**: Build the full credit card module — CRUD for cards, spent tracking UI, statement reset logic, and card dashboard cards.
**Deliverables**:
- `credit_cards` Supabase table + `cc_history` archive table
- Add/Edit/Delete card forms (name, limit, spent, reset_day)
- Card grid with available balance display (Indian format)
- Auto-reset logic: if today == reset_day AND month changed → archive spent, reset to 0
- "Total Credit Available" stat on mini dashboard
**Requirements**: Credit card fields, reset logic, Indian currency

### Phase 3: UPI/Bank Ledger + Friend IOU Tracker
**Status**: ⬜ Not Started
**Objective**: Build the UPI/bank transaction ledger (by source account) and the Friend IOU tracker with per-friend running net balance.
**Deliverables**:
- `bank_transactions` table (amount, source, type, note, date)
- Bank ledger UI grouped by source (SBI, Axis, etc.)
- `friends` table + `friend_transactions` table
- Friend IOU list with running net balance per friend (lent - borrowed)
- "Total Net Debt/Credit" stat on mini dashboard
**Requirements**: UPI/bank tracking, IOU ledger, net balance calc

### Phase 4: Journal Tab + Mini Dashboard + Mobile UX
**Status**: ⬜ Not Started
**Objective**: Build the global Journal view (all transactions, newest first), complete the mini dashboard stats, and implement the mobile-first "New Transaction" bottom sheet.
**Deliverables**:
- Journal tab: merged, sorted feed of ALL transactions (CC, bank, IOU)
- Mini dashboard: "Total Credit Available" + "Total Net Debt/Credit" brutalist stat cards
- Floating "New Transaction" button (bottom of screen, large, mobile-friendly)
- Bottom sheet / modal for quick transaction entry (one-handed flow)
**Requirements**: Journal, dashboard stats, mobile entry

### Phase 5: Polish + Data Integrity + Deployment
**Status**: ⬜ Not Started
**Objective**: Final QA pass — ensure reset logic idempotency, RLS policies on all Supabase tables, Vercel deployment, and responsive design audit.
**Deliverables**:
- Supabase Row Level Security (RLS) on all tables — owner-only access
- Idempotency guard on credit card reset (store last_reset_month)
- Full mobile responsive audit + fix
- Environment variable documentation
- Deploy to Vercel
**Requirements**: Security, correctness, deployment
