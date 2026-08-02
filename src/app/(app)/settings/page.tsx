import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Building2 } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const workspaceId = (session?.user as any)?.workspaceId;

  const workspace = await db.workspace.findUnique({ where: { id: workspaceId } });
  const apiKeys = await db.apiKey.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-400 mt-2">Manage your workspace settings and API keys.</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <Building2 className="h-5 w-5 text-zinc-400" />
            <div>
              <CardTitle className="text-base text-zinc-100">Workspace</CardTitle>
              <CardDescription className="text-zinc-500">Your current workspace details.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <span className="text-sm text-zinc-400">Name</span>
              <span className="text-sm font-medium text-zinc-100">{workspace?.name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-400">ID</span>
              <span className="text-xs font-mono text-zinc-500">{workspaceId}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <Key className="h-5 w-5 text-zinc-400" />
            <div>
              <CardTitle className="text-base text-zinc-100">API Keys</CardTitle>
              <CardDescription className="text-zinc-500">Keys for accessing the BinStruct REST API.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">No API keys yet.</p>
            ) : (
              <div className="space-y-2">
                {apiKeys.map((k) => (
                  <div key={k.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                    <span className="text-xs font-mono text-zinc-400">{k.key.slice(0, 8)}••••••••</span>
                    <span className="text-xs text-zinc-600">
                      {new Date(k.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
