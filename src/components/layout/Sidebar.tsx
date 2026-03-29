"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/services/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Sparkles,
  KanbanSquare,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/education", label: "Education", icon: GraduationCap },
  { href: "/skills", label: "Skills", icon: Wrench },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/tailor", label: "Tailor Resume", icon: Sparkles },
  { href: "/tracker", label: "Tracker", icon: KanbanSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-72 bg-card border-r border-border min-h-screen">
      <div className="p-6">
        <Link
          href="/dashboard"
          className="text-4xl font-bold text-primary transition-colors duration-150 hover:text-white"
        >
          Hirely
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "group w-full justify-start gap-3 transition-all duration-150 cursor-pointer",
                  isActive
                    ? "bg-white/15 text-white font-semibold hover:bg-white/20 hover:text-white"
                    : "hover:bg-white/10 hover:text-white active:scale-[0.98]",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span className="text-base font-semibold">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <Separator className="mb-3" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 transition-all duration-150 hover:bg-white/10 hover:text-white active:scale-[0.98] cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="size-5" />
          <span className="text-base font-semibold">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
