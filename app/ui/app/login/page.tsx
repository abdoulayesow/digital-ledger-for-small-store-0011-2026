"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { DeftarLogo } from "@/components/brand/DeftarLogo";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      if (!res.ok) {
        setError(t.common.error);
        return;
      }
      setStep("otp");
    } catch {
      setError(t.common.offline);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "expired" ? t.auth.codeExpired : t.auth.invalidCode);
        return;
      }
      router.push("/");
    } catch {
      setError(t.common.offline);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-0 px-6">
      {/* Logo */}
      <div className="mb-10">
        <DeftarLogo size={56} />
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="w-full max-w-sm flex flex-col gap-4">
          <label className="text-sm font-medium text-text-secondary">
            {t.auth.phoneNumber}
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.auth.enterPhone}
            autoFocus
            className={[
              "min-h-12 px-4 rounded-xl text-center text-lg",
              "bg-surface-2 text-text-primary placeholder:text-text-muted",
              "border border-surface-3/50 focus:border-brand",
              "focus:outline-none",
            ].join(" ")}
          />

          {error && <p className="text-sm text-debt text-center">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!phone.trim() || loading}
            className="mt-2"
          >
            {loading ? t.common.loading : t.auth.sendCode}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="w-full max-w-sm flex flex-col gap-4">
          <p className="text-sm text-text-secondary text-center">
            {t.auth.enterCode}
          </p>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            autoFocus
            maxLength={6}
            className={[
              "min-h-14 px-4 rounded-xl text-center text-2xl tracking-[0.3em]",
              "bg-surface-2 text-text-primary placeholder:text-text-muted",
              "border border-surface-3/50 focus:border-brand",
              "focus:outline-none font-mono",
            ].join(" ")}
          />

          {error && <p className="text-sm text-debt text-center">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={code.length < 6 || loading}
            className="mt-2"
          >
            {loading ? t.common.loading : t.auth.verifyCode}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setCode("");
              setError(null);
            }}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            {t.common.back}
          </button>
        </form>
      )}
    </div>
  );
}
