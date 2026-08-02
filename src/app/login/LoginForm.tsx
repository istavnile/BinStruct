"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/translations";
import type { Lang } from "@/lib/lang";

type Mode = "signin" | "signup";

export function LoginForm({ lang }: { lang: Lang }) {
  const T = useTranslations(lang);
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      toast.error(T.login_err_credentials);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error(T.login_err_mismatch); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? T.login_err_register); setLoading(false); return; }
      toast.success(T.login_success_created);
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        toast.error(T.login_err_login_after);
        setLoading(false);
      } else {
        router.push("/");
      }
    } catch {
      toast.error(T.login_err_generic);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080a0f]">
      <div aria-hidden className="pointer-events-none absolute inset-0 scanlines" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,157,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -bottom-60 -left-60 h-[500px] w-[500px] rounded-full bg-[#00ff9d]/5 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -top-60 -right-60 h-[400px] w-[400px] rounded-full bg-[#00d4ff]/5 blur-[100px]" />

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
              BINSTRUCT — AUTH
            </span>
          </div>

          <div className="px-6 py-6">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-[#00ff9d]/40 bg-[#00ff9d]/5">
                <span className="font-mono text-[10px] font-bold text-[#00ff9d]">BS</span>
              </div>
              <div>
                <p className="font-mono text-sm font-bold tracking-wider text-[#c9d5e0]">BINSTRUCT</p>
                <p className="font-mono text-[9px] text-[#3d4f60] tracking-[0.1em]">{T.login_subtitle}</p>
              </div>
            </div>

            {/* Mode tabs */}
            <div className="mb-6 flex border border-[#1c2232] font-mono text-xs">
              {(["signin", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 font-mono text-[11px] tracking-[0.1em] font-medium transition-all ${
                    mode === m
                      ? "bg-[#00ff9d]/10 text-[#00ff9d] border-b-2 border-[#00ff9d]"
                      : "text-[#3d4f60] hover:text-[#c9d5e0] border-b-2 border-transparent"
                  }`}
                >
                  {m === "signin" ? "sign_in" : "sign_up"}
                </button>
              ))}
            </div>

            {mode === "signin" ? (
              <>
                <p className="font-mono text-xs text-[#3d4f60] mb-5">{T.login_prompt_signin}</p>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <Field label={T.login_label_email} id="email" type="email" value={email} onChange={setEmail} />
                  <PasswordField
                    label={T.login_label_password}
                    id="password"
                    value={password}
                    onChange={setPassword}
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    extra={
                      <Link href="/forgot-password" className="font-mono text-[10px] text-[#00ff9d]/60 hover:text-[#00ff9d] transition-colors">
                        {T.login_forgot}
                      </Link>
                    }
                  />
                  <SubmitBtn loading={loading} label="$ sign_in" />
                </form>
              </>
            ) : (
              <>
                <p className="font-mono text-xs text-[#3d4f60] mb-5">{T.login_prompt_signup}</p>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <Field label={T.login_label_name} id="name" type="text" value={name} onChange={setName} />
                  <Field label={T.login_label_email} id="email-su" type="email" value={email} onChange={setEmail} />
                  <PasswordField
                    label={T.login_label_password}
                    id="pw-su"
                    value={password}
                    onChange={setPassword}
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    hint={T.login_pw_hint}
                  />
                  <PasswordField
                    label={T.login_label_confirm}
                    id="confirm"
                    value={confirm}
                    onChange={setConfirm}
                    show={showConfirm}
                    onToggle={() => setShowConfirm((v) => !v)}
                  />
                  <SubmitBtn loading={loading} label="$ create_account" />
                </form>
              </>
            )}
          </div>
        </div>

        <p className="font-mono text-[9px] text-[#1c2232] text-center mt-4 tracking-[0.15em] select-none">
          // desarrollado por{" "}
          <span className="text-[#2a3a4a]">Istav Nile</span>
          {" @ "}
          <span className="text-[#2a3a4a]">12 Development</span>
          {" · "}
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function Field({ label, id, type, value, onChange }: { label: string; id: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">{label}</Label>
      <Input id={id} type={type} required value={value} onChange={(e) => onChange(e.target.value)} className="bg-[#080a0f] border-[#1c2232] focus-visible:border-[#00ff9d]/50" />
    </div>
  );
}

function PasswordField({ label, id, value, onChange, show, onToggle, extra, hint }: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; extra?: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="font-mono text-[10px] tracking-[0.15em] text-[#3d4f60] uppercase">
          {label}
          {hint && <span className="ml-2 text-[#1c2232] normal-case tracking-normal">{hint}</span>}
        </Label>
        {extra}
      </div>
      <div className="relative">
        <Input id={id} type={show ? "text" : "password"} required value={value} onChange={(e) => onChange(e.target.value)} className="bg-[#080a0f] border-[#1c2232] focus-visible:border-[#00ff9d]/50 pr-10" />
        <button type="button" onClick={onToggle} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#3d4f60] hover:text-[#c9d5e0] transition-colors">
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="group flex h-9 w-full items-center justify-center gap-2 border border-[#00ff9d]/40 bg-[#00ff9d]/8 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#00ff9d] transition-all hover:bg-[#00ff9d]/15 hover:border-[#00ff9d]/70 hover:shadow-[0_0_16px_rgba(0,255,157,0.15)] disabled:opacity-40 disabled:cursor-not-allowed">
      {loading
        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> loading…</>
        : <><span>{label}</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>
      }
    </button>
  );
}
