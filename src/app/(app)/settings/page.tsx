import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Building2 } from "lucide-react";
import { ApiKeysSection } from "./ApiKeysSection";
import { LanguageSection } from "./LanguageSection";
import { ChangePasswordSection } from "./ChangePasswordSection";
import { getLang } from "@/lib/lang";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const workspaceId = (session?.user as any)?.workspaceId;

  const lang = getLang();
  const workspace = await db.workspace.findUnique({ where: { id: workspaceId } });
  const apiKeys = await db.apiKey.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[#00ff9d] text-sm">›</span>
          <h1 className="font-mono text-xl font-bold tracking-wide text-[#c9d5e0]">
            {lang === "es" ? "configuración" : "settings"}
          </h1>
        </div>
        <p className="font-mono text-xs text-[#3d4f60] pl-4">
          {lang === "es" ? "-- configuración del workspace" : "-- workspace configuration"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Workspace block */}
        <section className="border border-[#1c2232] bg-[#0c0e18] overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-[#1c2232] px-5 py-3">
            <span className="font-mono text-[10px] text-[#00ff9d] tracking-[0.15em]">// WORKSPACE</span>
            <Building2 className="h-3 w-3 text-[#3d4f60] ml-auto" />
          </div>
          <div className="divide-y divide-[#1c2232]">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="font-mono text-[11px] text-[#3d4f60]">name</span>
              <span className="font-mono text-[11px] text-[#c9d5e0]">{workspace?.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="font-mono text-[11px] text-[#3d4f60]">workspace_id</span>
              <span className="font-mono text-[10px] text-[#00d4ff]/70 select-all">{workspaceId}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="font-mono text-[11px] text-[#3d4f60]">role</span>
              <span className="font-mono text-[11px] text-[#9d5cff]">{(session?.user as any)?.role ?? "user"}</span>
            </div>
          </div>
        </section>

        {/* Language selector */}
        <LanguageSection current={lang} />

        {/* Change password */}
        <ChangePasswordSection lang={lang} />

        {/* API Keys — interactive client component */}
        <ApiKeysSection initialKeys={apiKeys} lang={lang} />
      </div>
    </div>
  );
}
