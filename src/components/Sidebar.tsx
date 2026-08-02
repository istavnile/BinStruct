"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, Settings, LogOut, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import type { Lang } from "@/lib/lang";
import { HelpModal, useHelpAutoOpen } from "@/components/HelpModal";

const NAV = {
  es: [
    { name: "Plantillas",     href: "/templates", icon: FolderTree, key: "templates" },
    { name: "Configuración",  href: "/settings",  icon: Settings,   key: "settings"  },
  ],
  en: [
    { name: "Templates", href: "/templates", icon: FolderTree, key: "templates" },
    { name: "Settings",  href: "/settings",  icon: Settings,   key: "settings"  },
  ],
};

export function Sidebar({ lang = "es" }: { lang?: Lang }) {
  const pathname = usePathname();
  const navigation = NAV[lang];
  const [helpAutoOpen, setHelpAutoOpen] = useHelpAutoOpen();
  const [helpOpen, setHelpOpen] = useState(false);
  const isHelpOpen = helpAutoOpen || helpOpen;

  return (
    <aside className="relative flex h-screen w-56 shrink-0 flex-col border-r border-[#1c2232] bg-[#080a0f] overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 scanlines opacity-60 z-0" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3 border-b border-[#1c2232] px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center border border-[#00ff9d]/40 bg-[#00ff9d]/5">
          <span className="font-mono text-[10px] font-bold text-[#00ff9d] leading-none">BS</span>
        </div>
        <div>
          <span className="font-mono text-sm font-bold tracking-wider text-[#c9d5e0]">BINSTRUCT</span>
          <p className="font-mono text-[9px] text-[#3d4f60] tracking-[0.15em]">v0.1.0</p>
        </div>
      </div>

      {/* Nav */}
      <div className="relative z-10 flex-1 px-3 py-4 space-y-0.5">
        <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#3d4f60] px-2 mb-3">
          // NAVIGATION
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 py-2 font-mono text-xs font-medium tracking-wide transition-all duration-100 border-l-2",
                isActive
                  ? "pl-[6px] pr-2 text-[#00ff9d] bg-[#00ff9d]/5 border-[#00ff9d]"
                  : "pl-[6px] pr-2 text-[#3d4f60] border-transparent hover:text-[#c9d5e0] hover:bg-[#1c2232]/30"
              )}
            >
              <item.icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-[#00ff9d]" : "text-[#3d4f60] group-hover:text-[#c9d5e0]")} />
              <span>{item.name}</span>
              {isActive && <span className="ml-auto font-mono text-[9px] text-[#00ff9d]/50">›</span>}
            </Link>
          );
        })}
      </div>

      {/* Help + Sign out */}
      <div className="relative z-10 border-t border-[#1c2232] px-3 py-3 space-y-0.5">
        <button
          onClick={() => setHelpOpen(true)}
          className="group flex w-full items-center gap-2.5 py-2 pl-[6px] pr-2 font-mono text-xs font-medium tracking-wide text-[#3d4f60] transition-all duration-100 border-l-2 border-transparent hover:text-[#c9d5e0] hover:border-[#3d4f60] hover:bg-[#1c2232]/30"
        >
          <HelpCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{lang === "en" ? "help" : "ayuda"}</span>
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center gap-2.5 py-2 pl-[6px] pr-2 font-mono text-xs font-medium tracking-wide text-[#3d4f60] transition-all duration-100 border-l-2 border-transparent hover:text-[#ff4545] hover:border-[#ff4545]/60 hover:bg-[#ff4545]/5"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          <span>$ logout</span>
        </button>
      </div>

      <HelpModal
        open={isHelpOpen}
        onOpenChange={(v) => { setHelpAutoOpen(v); setHelpOpen(v); }}
        lang={lang}
      />
    </aside>
  );
}
