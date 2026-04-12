# STATE.md — Project Memory

> **Last Updated**: 2026-04-12
> **Project**: Nexus Ledger Pro

## Current Position
- **Phase**: 1 (Not Started)
- **Status**: Planning complete — ready for execution
- **Milestone**: v1.0

## Next Steps
1. `/execute 1` — Scaffold Next.js project + Supabase Auth
2. `/execute 2` — Credit Card system
3. `/execute 3` — UPI/Bank Ledger + Friend IOU
4. `/execute 4` — Journal + Dashboard + Mobile UX
5. `/execute 5` — Polish + RLS + Deploy

## Key Decisions
- Tech: Next.js App Router + Tailwind + Supabase
- Auth: Google OAuth, restricted to owner email via middleware
- Currency: All INR via `Intl.NumberFormat('en-IN')`
- Reset logic: Idempotent, guarded by `last_reset_month` column
