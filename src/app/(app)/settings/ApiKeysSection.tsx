"use client";

import { useState } from "react";
import { createApiKey, deleteApiKey } from "@/actions/api-keys";
import { toast } from "sonner";
import { Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "@/lib/translations";
import type { Lang } from "@/lib/lang";

type ApiKey = { id: string; key: string; createdAt: Date };

export function ApiKeysSection({ initialKeys, lang = "es" }: { initialKeys: ApiKey[]; lang?: Lang }) {
  const T = useTranslations(lang);
  const [keys, setKeys] = useState(initialKeys);
  const [loading, setLoading] = useState(false);
  const [newKeyId, setNewKeyId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const handleCreate = async () => {
    setLoading(true);
    try {
      const k = await createApiKey();
      const entry = { ...k, createdAt: new Date(k.createdAt) };
      setKeys((prev) => [entry, ...prev]);
      setNewKeyId(k.id);
      setRevealed((prev) => new Set([...prev, k.id]));
      toast.success("API key generada");
    } catch {
      toast.error("Error al generar la key");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApiKey(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
      if (newKeyId === id) setNewKeyId(null);
      toast.success("Key eliminada");
    } catch {
      toast.error("Error al eliminar la key");
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copiada al portapapeles");
  };

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const mask = (key: string) =>
    `${key.slice(0, 10)}${"•".repeat(20)}${key.slice(-4)}`;

  return (
    <section className="border border-[#1c2232] bg-[#0c0e18] overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-[#1c2232] px-5 py-3">
        <span className="font-mono text-[10px] text-[#00ff9d] tracking-[0.15em]">// API_KEYS</span>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-[#3d4f60] hover:text-[#00ff9d] border border-[#1c2232] hover:border-[#00ff9d]/40 px-2.5 py-1 transition-all disabled:opacity-40"
        >
          <Plus className="h-3 w-3" />
          {loading ? T.settings_api_creating : T.settings_api_new}
        </button>
      </div>

      {keys.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="font-mono text-[11px] text-[#3d4f60]">{T.settings_api_empty}</p>
        </div>
      ) : (
        <div className="divide-y divide-[#1c2232]">
          {keys.map((k) => {
            const isNew = k.id === newKeyId;
            const isVisible = revealed.has(k.id);
            return (
              <div
                key={k.id}
                className={`flex items-center justify-between gap-4 px-5 py-3 transition-colors ${isNew ? "bg-[#00ff9d]/[0.03]" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isNew && (
                      <span className="font-mono text-[9px] text-[#00ff9d] border border-[#00ff9d]/30 px-1.5 py-0.5 leading-none shrink-0">
                        NEW
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-[#5a6a7a] truncate select-all">
                      {isVisible ? k.key : mask(k.key)}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#2a3a4a] mt-0.5 block">
                    {new Date(k.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleReveal(k.id)}
                    className="flex h-7 w-7 items-center justify-center text-[#3d4f60] hover:text-[#c9d5e0] transition-colors"
                    title={isVisible ? "Ocultar" : "Mostrar"}
                  >
                    {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleCopy(k.key)}
                    className="flex h-7 w-7 items-center justify-center text-[#3d4f60] hover:text-[#00d4ff] transition-colors"
                    title={T.settings_api_copy}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="flex h-7 w-7 items-center justify-center text-[#3d4f60] hover:text-[#ff4545] transition-colors"
                    title={T.settings_api_delete}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="px-5 py-3 border-t border-[#1c2232]">
        <p className="font-mono text-[10px] text-[#1c2232] leading-relaxed">
          {T.settings_api_footer}
        </p>
      </div>
    </section>
  );
}
