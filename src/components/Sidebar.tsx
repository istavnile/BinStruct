"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, LayoutDashboard, Settings, LogOut, LayoutTemplate, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Templates", href: "/templates", icon: FolderTree },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-60 flex-col border-r border-white/5 bg-[#0a0a0f] px-3 py-5">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2.5 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20">
          <LayoutTemplate className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-white">BinStruct</span>
        </div>
      </div>

      {/* Nav label */}
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Navigation
      </p>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-violet-500/10 text-violet-300"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  isActive ? "text-violet-400" : "text-zinc-600 group-hover:text-zinc-400"
                )}
              />
              {item.name}
              {isActive && (
                <ChevronRight className="ml-auto h-3 w-3 text-violet-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom divider + sign out */}
      <div className="border-t border-white/5 pt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4 flex-shrink-0 group-hover:text-red-400" />
          Sign out
        </button>
      </div>
    </div>
  );
}
