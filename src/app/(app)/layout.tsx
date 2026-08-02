import { Sidebar } from "@/components/Sidebar";
import { getLang } from "@/lib/lang";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const lang = getLang();
  return (
    <div className="flex h-screen overflow-hidden bg-[#080a0f]">
      <Sidebar lang={lang} />
      <main className="relative flex-1 overflow-y-auto text-[#c9d5e0] flex flex-col">
        <div aria-hidden className="pointer-events-none fixed inset-0 scanlines opacity-30 z-0" />
        <div className="relative z-10 flex-1 p-8">
          {children}
        </div>
        <footer className="relative z-10 border-t border-[#1c2232]/60 px-8 py-3 shrink-0">
          <p className="font-mono text-[9px] text-[#1c2232] tracking-[0.15em] select-none">
            // desarrollado por{" "}
            <span className="text-[#2a3a4a]">Istav Nile</span>
            {" @ "}
            <span className="text-[#2a3a4a]">12 Development</span>
            {" · "}
            {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
