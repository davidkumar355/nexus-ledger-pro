---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: RLS Security + Deployment

## Objective
Lock down all Supabase tables with Row Level Security policies, add idempotency guard validation, create environment variable documentation, and deploy to Vercel.

## Context
- `.gsd/SPEC.md`
- All previous plans

## Tasks

<task type="auto">
  <name>Enable Row Level Security on all tables</name>
  <files>supabase/migrations/004_rls_policies.sql</files>
  <action>
    ```sql
    -- RLS policies: users can only access their own data
    
    -- credit_cards
    CREATE POLICY "owner_only" ON credit_cards
      FOR ALL USING (auth.uid() = user_id);
    
    -- cc_history
    CREATE POLICY "owner_only" ON cc_history
      FOR ALL USING (auth.uid() = user_id);
    
    -- bank_transactions
    CREATE POLICY "owner_only" ON bank_transactions
      FOR ALL USING (auth.uid() = user_id);
    
    -- friends
    CREATE POLICY "owner_only" ON friends
      FOR ALL USING (auth.uid() = user_id);
    
    -- friend_transactions
    CREATE POLICY "owner_only" ON friend_transactions
      FOR ALL USING (auth.uid() = user_id);
    ```

    Test: try fetching data as unauthenticated → should return 0 rows.
    Note: OWNER_EMAIL middleware is the first gate; RLS is the defense-in-depth second gate.
  </action>
  <verify>Test-Path "supabase/migrations/004_rls_policies.sql"</verify>
  <done>All 5 tables have owner_only RLS policies applied in Supabase dashboard</done>
</task>

<task type="auto">
  <name>README + .env documentation</name>
  <files>README.md, .env.local.example, .gitignore</files>
  <action>
    Create `README.md`:
    ```markdown
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
    ```

    Ensure `.gitignore` includes: `.env.local`, `node_modules/`, `.next/`
  </action>
  <verify>Test-Path "README.md"</verify>
  <done>README covers setup, env vars, and deploy instructions</done>
</task>

<task type="checkpoint:human-verify">
  <name>Deploy to Vercel + smoke test</name>
  <action>
    1. Push repo to GitHub: `git push origin main`
    2. Go to vercel.com → Import project from GitHub
    3. Add all 3 env vars in Vercel project settings
    4. Deploy
    5. Verify: login works, credit cards load, bank ledger works, journal shows entries
  </action>
  <done>App live at Vercel URL; all features work in production</done>
</task>

## Success Criteria
- [ ] RLS policies applied to all 5 tables
- [ ] Unauthenticated requests return 0 rows from Supabase
- [ ] README documents setup and deploy steps
- [ ] App deployed and accessible at Vercel URL
- [ ] All features verified in production
