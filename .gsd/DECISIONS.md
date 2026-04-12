# DECISIONS.md — Architecture Decision Log

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2026-04-12 | Next.js App Router | Modern RSC model, good Supabase SSR support | Decided |
| 2026-04-12 | Supabase Auth (Google OAuth) | Built-in OAuth, no custom server needed | Decided |
| 2026-04-12 | Email allowlist via Next.js middleware | Simplest single-user restriction pattern | Decided |
| 2026-04-12 | No CSV export in v1 | Out of scope to keep v1 lean | Decided |
| 2026-04-12 | `last_reset_month` column for idempotency | Prevents double-reset if checked multiple times/day | Decided |
