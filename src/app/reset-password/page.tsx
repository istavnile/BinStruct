"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Las contraseñas no coinciden."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong.");
      } else {
        setDone(true);
      }
    } catch {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="border border-[#1c2232] bg-[#0c0e18] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-[#1c2232] px-4 py-2.5 bg-[#080a0f]">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff4545]/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffb800]/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00ff9d]/60" />
        </div>
        <span className="font-mono text-[10px] text-[#3d4f60] tracking-[0.15em] mx-auto">
          BINSTRUCT — RESET_PASSWORD
        </span>
      </div>

      <div className="px-6 py-6">
        {/* Logo */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-[#00ff9d]/40 bg-[#00ff9d]/5">
            <span className="font-mono text-[10px] font-bold text-[#00ff9d]">BS</span>
          </div>
          <div>
            <p className="font-mono text-sm font-bold tracking-wider text-[#c9d5e0]">BINSTRUCT</p>
            <p className="font-mono text-[9px] text-[#3d4f60] tracking-[0.1em]">template management</p>
          </div>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-4 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center border border-[#00ff9d]/30 bg-[#00ff9d]/5">
              <CheckCircle2 className="h-5 w-5 text-[#00ff9d]" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-[#c9d5e0]">// password_updated</p>
              <p className="font-mono text-[11px] text-[#3d4f60] mt-2">Tu contraseña ha sido actualizada. Ya puedes iniciar sesión.</p>
            </div>
            <Link
              href="/login"
              className="font-mono text-[11px] text-[#00ff9d]/70 border border-[#00ff9d]/30 hover:border-[#00ff9d]/60 hover:text-[#00ff9d] px-4 py-1.5 transition-all"
            >
              → ir al login
            </Link>
          </div>
        ) : (
          <>
            <p className="font-mono text-xs text-[#3d4f60] mb-5">
              {"> "}elige una nueva contraseña para tu cuenta
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pw" className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">
                  nueva contraseña <span className="normal-case tracking-normal text-[#1c2232]">// min. 8 chars</span>
                </Label>
                <div className="relative">
                  <Input
                    id="pw"
                    type={showPw ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#080a0f] border-[#1c2232] focus-visible:border-[#00ff9d]/50 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#3d4f60] hover:text-[#c9d5e0] transition-colors">
                    {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cf" className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">
                  confirmar contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="cf"
                    type={showCf ? "text" : "password"}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="bg-[#080a0f] border-[#1c2232] focus-visible:border-[#00ff9d]/50 pr-10"
                  />
                  <button type="button" onClick={() => setShowCf((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#3d4f60] hover:text-[#c9d5e0] transition-colors">
                    {showCf ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex h-9 w-full items-center justify-center gap-2 border border-[#00ff9d]/40 bg-[#00ff9d]/8 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#00ff9d] transition-all hover:bg-[#00ff9d]/15 hover:border-[#00ff9d]/70 hover:shadow-[0_0_16px_rgba(0,255,157,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> actualizando…</> : "$ update_password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080a0f]">
      <div aria-hidden className="pointer-events-none absolute inset-0 scanlines" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,157,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,157,0.3) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 w-full max-w-sm px-4">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
