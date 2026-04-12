---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Supabase Setup + Google OAuth + Email Restriction

## Objective
Configure Supabase Auth with Google OAuth. Implement Next.js middleware that blocks all users except the owner's email. Create the base app layout (nav, page container).

## Context
- `.gsd/SPEC.md`
- `.gsd/phases/1/1-PLAN.md` (must be complete)

## Tasks

<task type="auto">
  <name>Supabase client configuration + environment variables</name>
  <files>src/lib/supabase/client.ts, src/lib/supabase/server.ts, .env.local.example</files>
  <action>
    Create `src/lib/supabase/client.ts`:
    ```ts
    import { createBrowserClient } from '@supabase/ssr'
    export const createClient = () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    ```

    Create `src/lib/supabase/server.ts` using `createServerClient` from @supabase/ssr with cookies().

    Create `.env.local.example`:
    ```
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    OWNER_EMAIL=your@gmail.com
    ```

    Do NOT commit real .env.local — add to .gitignore.
  </action>
  <verify>Test-Path "src/lib/supabase/client.ts"</verify>
  <done>Both supabase client and server files exist; .env.local.example documented</done>
</task>

<task type="auto">
  <name>Auth routes + email-restriction middleware</name>
  <files>src/app/auth/callback/route.ts, src/app/login/page.tsx, src/middleware.ts, src/app/access-denied/page.tsx</files>
  <action>
    1. Create `src/middleware.ts` — runs on every request:
       - Get session from Supabase
       - If no session AND path !== /login AND path !== /auth/callback → redirect to /login
       - If session AND user.email !== process.env.OWNER_EMAIL → redirect to /access-denied
       - Otherwise allow

    2. Create `src/app/login/page.tsx` — brutalist login page:
       - Dark canvas (#000), white text
       - "Nexus Ledger Pro" title in bold
       - Single "Continue with Google" button (border-brutal bg-canvas text-ink shadow-brutal)
       - On click: `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/auth/callback' } })`

    3. Create `src/app/auth/callback/route.ts` — exchanges code for session, redirects to /

    4. Create `src/app/access-denied/page.tsx` — shows "Access Denied. This ledger is private." in danger red.

    CRITICAL: middleware must read OWNER_EMAIL from process.env (server-side only, not NEXT_PUBLIC).
  </action>
  <verify>Test-Path "src/middleware.ts"</verify>
  <done>Login page renders; middleware blocks non-owner; /access-denied page exists</done>
</task>

<task type="auto">
  <name>Base app layout shell</name>
  <files>src/app/(app)/layout.tsx, src/app/(app)/page.tsx, src/components/Nav.tsx</files>
  <action>
    Create route group `src/app/(app)/` for all authenticated pages.

    `Nav.tsx` — horizontal top nav, brutalist style:
    - Logo: "NLP" in bold, border-brutal px-2
    - Nav links: Cards | Bank | Friends | Journal (text-ink, hover:bg-warning transition)
    - Right: user email + "Sign Out" button (calls supabase.auth.signOut())

    `(app)/layout.tsx`:
    - Renders Nav at top
    - `<main className="max-w-5xl mx-auto px-4 py-6">` for content
    - bg-canvas min-h-screen

    `(app)/page.tsx` — placeholder: "Dashboard coming soon" in bold
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>App builds cleanly; login flow works; authenticated users see nav layout</done>
</task>

<task type="checkpoint:human-verify">
  <name>Verify auth flow end-to-end</name>
  <action>Run `npm run dev`, open browser, confirm: (1) unauthenticated → /login, (2) wrong email → /access-denied, (3) correct email → dashboard shell with nav</action>
  <done>All three flows verified manually</done>
</task>

## Success Criteria
- [ ] Supabase client/server helpers configured
- [ ] Google OAuth login page renders
- [ ] Middleware blocks non-owner emails
- [ ] Base layout shell (Nav + main) renders for authenticated user
