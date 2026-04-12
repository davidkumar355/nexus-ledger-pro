# Nexus Ledger Pro

Private personal finance orchestrator. Single-user, Google OAuth.

## Setup
1. Create Supabase project, enable Google OAuth provider
2. Copy `.env.local.example` → `.env.local` and fill values
3. Run all SQL migrations in Supabase SQL editor (in order)
4. `npm install && npm run dev`

## Environment Variables
| Variable | Description |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key |
| OWNER_EMAIL | Only this email can log in |

## Deploy
Push to GitHub → connect repo to Vercel → set env vars in Vercel dashboard.
