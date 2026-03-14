'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/experience', label: 'Experience', icon: Briefcase },
  { href: '/education', label: 'Education', icon: GraduationCap },
  { href: '/skills', label: 'Skills', icon: Wrench },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/tailor', label: 'Tailor Resume', icon: Sparkles },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-card border-r border-border min-h-screen">
      <div className="p-6">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          Hirely
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start gap-3', isActive && 'font-semibold')}
              >
                <Icon className="size-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-3">
        <Separator className="mb-3" />
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleSignOut}>
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
