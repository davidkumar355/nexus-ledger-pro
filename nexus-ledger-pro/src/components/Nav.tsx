'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navLinks = [
  { href: '/',         label: 'Dashboard' },
  { href: '/cards',    label: 'Cards' },
  { href: '/bank',     label: 'Bank' },
  { href: '/friends',  label: 'Friends' },
  { href: '/journal',  label: 'Journal' },
]

export default function Nav({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b-[3px] border-ink bg-canvas sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-1 overflow-x-auto">
        {/* Logo */}
        <div className="flex-shrink-0 mr-4">
          <span className="border-[3px] border-ink px-2 py-0.5 font-black text-xs tracking-[0.25em] uppercase select-none">
            NLP
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 flex-1">
          {navLinks.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'px-3 py-1.5 font-bold text-sm uppercase tracking-wide transition-all duration-75',
                  active
                    ? 'bg-ink text-canvas'
                    : 'text-ink hover:bg-warning',
                ].join(' ')}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* User + sign out */}
        <div className="flex-shrink-0 flex items-center gap-2 ml-2">
          <span className="text-ink/40 text-xs font-medium hidden sm:block max-w-[140px] truncate">
            {email}
          </span>
          <button
            onClick={handleSignOut}
            className="btn-brutal px-3 py-1.5 text-xs font-black uppercase tracking-wide bg-danger text-canvas"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
