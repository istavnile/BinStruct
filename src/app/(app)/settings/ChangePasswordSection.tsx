"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/actions/change-password";
import type { Lang } from "@/lib/lang";

export function ChangePasswordSection({ lang }: { lang: Lang }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      toast.error(lang === "es" ? "Las contraseñas no coinciden" : "Passwords don't match");
      return;
    }
    if (next.length < 8) {
      toast.error(lang === "es" ? "Mínimo 8 caracteres" : "Minimum 8 characters");
      return;
    }
    startTransition(async () => {
      try {
        await changePassword(current, next);
        toast.success(lang === "es" ? "Contraseña actualizada" : "Password updated");
        setCurrent(""); setNext(""); setConfirm("");
      } catch (err: any) {
        const msg = err?.message;
        if (msg === "wrong_password") {
          toast.error(lang === "es" ? "Contraseña actual incorrecta" : "Current password is incorrect");
        } else if (msg === "too_short") {
          toast.error(lang === "es" ? "Mínimo 8 caracteres" : "Minimum 8 characters");
        } else {
          toast.error(lang === "es" ? "Error al cambiar contraseña" : "Failed to change password");
        }
      }
    });
  };

  return (
    <section className="border border-[#1c2232] bg-[#0c0e18] overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-[#1c2232] px-5 py-3">
        <span className="font-mono text-[10px] text-[#00ff9d] tracking-[0.15em]">
          {lang === "es" ? "// CONTRASEÑA" : "// PASSWORD"}
        </span>
        <KeyRound className="h-3 w-3 text-[#3d4f60] ml-auto" />
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
        <PasswordField
          id="current-pw"
          label={lang === "es" ? "contraseña actual" : "current password"}
          value={current}
          onChange={setCurrent}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
        />
        <PasswordField
          id="new-pw"
          label={lang === "es" ? "nueva contraseña" : "new password"}
          value={next}
          onChange={setNext}
          show={showNext}
          onToggle={() => setShowNext((v) => !v)}
          hint="// mín. 8 caracteres"
        />
        <PasswordField
          id="confirm-pw"
          label={lang === "es" ? "confirmar nueva contraseña" : "confirm new password"}
          value={confirm}
          onChange={setConfirm}
          show={showNext}
          onToggle={() => setShowNext((v) => !v)}
        />

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={pending || !current || !next || !confirm}
            className="font-mono text-[11px] text-[#00ff9d] border border-[#00ff9d]/40 bg-[#00ff9d]/5 hover:bg-[#00ff9d]/12 hover:border-[#00ff9d]/60 px-4 py-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {pending && <Loader2 className="h-3 w-3 animate-spin" />}
            {pending
              ? (lang === "es" ? "actualizando…" : "updating…")
              : (lang === "es" ? "$ actualizar_contraseña" : "$ update_password")}
          </button>
        </div>
      </form>
    </section>
  );
}

function PasswordField({ id, label, value, onChange, show, onToggle, hint }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">{label}</Label>
        {hint && <span className="font-mono text-[9px] text-[#1c2232]">{hint}</span>}
      </div>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#080a0f] border-[#1c2232] focus-visible:border-[#00ff9d]/40 pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#3d4f60] hover:text-[#c9d5e0] transition-colors"
        >
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
