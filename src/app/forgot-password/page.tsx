"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Something went wrong.");
      } else {
        setSent(true);
      }
    } catch {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

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
        <div className="border border-[#1c2232] bg-[#0c0e18] overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-[#1c2232] px-4 py-2.5 bg-[#080a0f]">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff4545]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffb800]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#00ff9d]/60" />
            </div>
            <span className="font-mono text-[10px] text-[#3d4f60] tracking-[0.15em] mx-auto">
              BINSTRUCT — RESET
            </span>
          </div>

          <div className="px-6 py-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-[#00ff9d]/40 bg-[#00ff9d]/5">
                <span className="font-mono text-[10px] font-bold text-[#00ff9d]">BS</span>
              </div>
              <div>
                <p className="font-mono text-sm font-bold tracking-wider text-[#c9d5e0]">BINSTRUCT</p>
                <p className="font-mono text-[9px] text-[#3d4f60] tracking-[0.1em]">template management</p>
              </div>
            </div>

            {sent ? (
              <div className="flex flex-col items-center py-4 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center border border-[#00ff9d]/30 bg-[#00ff9d]/5">
                  <MailCheck className="h-5 w-5 text-[#00ff9d]" />
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-[#c9d5e0]">// mail_sent</p>
                  <p className="font-mono text-[11px] text-[#3d4f60] mt-2 leading-relaxed">
                    Si <span className="text-[#c9d5e0]">{email}</span> está registrado,
                    recibirás un enlace de reset. Expira en 1h.
                  </p>
                </div>
                <Link href="/login" className="font-mono text-[11px] text-[#00ff9d]/60 hover:text-[#00ff9d] flex items-center gap-1.5 transition-colors mt-2">
                  <ArrowLeft className="h-3 w-3" /> volver al login
                </Link>
              </div>
            ) : (
              <>
                <p className="font-mono text-xs text-[#3d4f60] mb-5">
                  {"> "}ingresa tu email para recibir un enlace de reset
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">
                      email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#080a0f] border-[#1c2232] focus-visible:border-[#00ff9d]/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-9 w-full items-center justify-center gap-2 border border-[#00ff9d]/40 bg-[#00ff9d]/8 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#00ff9d] transition-all hover:bg-[#00ff9d]/15 hover:border-[#00ff9d]/70 disabled:opacity-40"
                  >
                    {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> enviando…</> : "$ send_reset_link"}
                  </button>
                  <Link href="/login" className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#3d4f60] hover:text-[#c9d5e0] transition-colors">
                    <ArrowLeft className="h-3 w-3" /> volver al login
                  </Link>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
