"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLang } from "@/actions/lang";
import type { Lang } from "@/lib/lang";

const OPTIONS: { value: Lang; label: string; sub: string }[] = [
  { value: "es", label: "ES", sub: "Español" },
  { value: "en", label: "EN", sub: "English" },
];

export function LanguageSection({ current }: { current: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSelect = (lang: Lang) => {
    if (lang === current || pending) return;
    startTransition(() => {
      setLang(lang).then(() => router.refresh());
    });
  };

  return (
    <section className="border border-[#1c2232] bg-[#0c0e18] overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-[#1c2232] px-5 py-3">
        <span className="font-mono text-[10px] text-[#00ff9d] tracking-[0.15em]">// IDIOMA</span>
        <span className="font-mono text-[10px] text-[#3d4f60] ml-1">/ LANGUAGE</span>
      </div>
      <div className="px-5 py-4 flex items-center gap-3">
        {OPTIONS.map((opt) => {
          const isActive = opt.value === current;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={pending}
              className={[
                "flex items-center gap-2.5 px-4 py-2.5 border font-mono transition-all duration-150 disabled:opacity-50",
                isActive
                  ? "border-[#00ff9d]/60 bg-[#00ff9d]/8 text-[#00ff9d]"
                  : "border-[#1c2232] text-[#3d4f60] hover:border-[#3d4f60] hover:text-[#c9d5e0]",
              ].join(" ")}
            >
              <span className={`text-sm font-bold tracking-widest ${isActive ? "text-[#00ff9d]" : ""}`}>
                {opt.label}
              </span>
              <span className={`text-[11px] ${isActive ? "text-[#00ff9d]/70" : "text-[#2a3a4a]"}`}>
                {opt.sub}
              </span>
              {isActive && <span className="ml-1 font-mono text-[9px] text-[#00ff9d]/50">●</span>}
            </button>
          );
        })}
        {pending && <span className="font-mono text-[10px] text-[#3d4f60] animate-pulse">switching…</span>}
      </div>
    </section>
  );
}
