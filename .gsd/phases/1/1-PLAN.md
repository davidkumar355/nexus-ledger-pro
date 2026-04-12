---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Next.js Scaffold + Tailwind Neo-Brutalist Tokens

## Objective
Bootstrap the Next.js 14 App Router project, install all dependencies, and configure the Tailwind design system with custom Neo-Brutalist tokens. This is the foundation everything else builds on.

## Context
- `.gsd/SPEC.md`
- `.gsd/ROADMAP.md`

## Tasks

<task type="auto">
  <name>Scaffold Next.js App Router project</name>
  <files>package.json, tailwind.config.ts, next.config.ts, tsconfig.json</files>
  <action>
    Run in D:\PythonLearn\Budget Planer:

    ```
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
    ```

    Then install additional dependencies:
    ```
    npm install @supabase/supabase-js @supabase/ssr lucide-react
    ```

    Do NOT install shadcn/ui — use custom brutalist components only.
  </action>
  <verify>node -e "require('./package.json').dependencies['@supabase/supabase-js'] && console.log('OK')"</verify>
  <done>package.json lists next, @supabase/supabase-js, @supabase/ssr, lucide-react</done>
</task>

<task type="auto">
  <name>Configure Tailwind with Neo-Brutalist design tokens</name>
  <files>tailwind.config.ts, src/app/globals.css</files>
  <action>
    Extend tailwind.config.ts with:

    ```ts
    theme: {
      extend: {
        colors: {
          canvas: '#FDFDFD',
          success: '#00FF66',
          danger: '#FF3D00',
          warning: '#FFD600',
          ink: '#000000',
        },
        boxShadow: {
          brutal: '6px 6px 0px 0px rgba(0,0,0,1)',
          'brutal-sm': '3px 3px 0px 0px rgba(0,0,0,1)',
        },
        borderWidth: {
          brutal: '3px',
        },
        fontFamily: {
          sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
        },
      },
    }
    ```

    In globals.css set: `background-color: #FDFDFD` on body.
    Add a utility class `.card-brutal` = `border-brutal border-ink shadow-brutal bg-canvas`.
  </action>
  <verify>npx tailwindcss --content "src/**/*.tsx" --postcss 2>&1 | head -5</verify>
  <done>tailwind.config.ts has colors.success, colors.danger, boxShadow.brutal defined</done>
</task>

## Success Criteria
- [ ] `npm run dev` starts without errors
- [ ] Tailwind brutalist tokens available (success, danger, shadow-brutal)
- [ ] Lucide React and Supabase packages installed
