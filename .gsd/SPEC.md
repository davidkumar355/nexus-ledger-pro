# SPEC.md — Nexus Ledger Pro

> **Status**: `FINALIZED`

## Vision
Nexus Ledger Pro is a private, cloud-synced personal finance orchestrator built for a single authenticated user. It tracks credit card cycles, UPI/bank transactions, and inter-personal IOUs in a high-fidelity Neo-Brutalist x Swiss Minimalist UI — no graphs, no noise, just ledger-grade data clarity.

## Goals
1. Secure single-user access via Google OAuth (Supabase Auth) restricted to one specific email
2. Full credit card management with automatic monthly statement reset logic
3. UPI/bank ledger tracking by source account
4. Friend IOU tracker with running per-friend net balance
5. Complete immutable transaction journal sorted by date

## Non-Goals (Out of Scope)
- Multi-user / team sharing
- Bank API / automatic import (manual entry only)
- Charts, graphs, or visual analytics
- Mobile app (responsive web only)
- Export to CSV/Excel in v1

## Users
Single user — the owner. Only one email (configured at build time via env var) can authenticate and access data. All visitors without that email see an "Access Denied" page.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v3 with custom Neo-Brutalist tokens
- **Icons**: Lucide React
- **Backend / DB**: Supabase (PostgreSQL + Auth)
- **Auth**: Supabase Google OAuth, restricted by email allowlist

## Design System — Neo-Brutalism x Swiss Minimalist
| Token | Value |
|---|---|
| Canvas | `#FDFDFD` |
| Border | `3px solid #000000` |
| Shadow | `6px 6px 0px 0px rgba(0,0,0,1)` (hard black) |
| Success | `#00FF66` |
| Danger | `#FF3D00` |
| Warning | `#FFD600` |
| Font | Inter / Geist Sans, bold weights |
| Grid | Strict 8px grid alignment |

## Currency Logic
All amounts displayed using `Intl.NumberFormat('en-IN')` → ₹XX,XX,XXX.XX (Indian numbering system, INR symbol).

## Constraints
- Single-user application (no public registration flow)
- Supabase free tier compatible (no edge functions required for core features)
- Must work well on mobile screens (one-handed entry pattern)
- Statement reset logic must be idempotent (safe to run multiple times per day)

## Success Criteria
- [ ] Only the owner email can log in; all others are blocked
- [ ] Credit cards show correct available balance and reset automatically on statement day
- [ ] UPI/bank transactions tracked per source account with running total
- [ ] Friend IOU net balance correct (lending positive, borrowing negative)
- [ ] Journal tab shows all transactions ever, newest first, no data missing
- [ ] All currency displays in Indian format (₹X,XX,XXX.XX)
- [ ] Mobile-friendly with large "New Transaction" CTA at bottom
