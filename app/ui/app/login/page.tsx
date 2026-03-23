"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { BtikiLogo } from "@/components/brand/BtikiLogo";
import { Button } from "@/components/ui/Button";
import { enterDemoMode, exitDemoMode } from "@/lib/demo-session";
import { seedDemoData } from "@/lib/db/dev-seed";

type Channel = "whatsapp" | "sms";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOtp(selectedChannel: Channel) {
    if (!phone.trim()) return;

    setLoading(true);
    setError(null);
    setChannel(selectedChannel);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), channel: selectedChannel }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "too_many_requests") {
          setError(t.auth.tooManyAttempts);
        } else if (data.suggestion === "sms") {
          setError(t.auth.networkRequired);
        } else {
          setError(t.auth.networkRequired);
        }
        return;
      }

      setStep("otp");
    } catch {
      setError(t.auth.networkRequired);
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
        if (data.error === "too_many_attempts") {
          setError(t.auth.tooManyAttempts);
        } else if (data.error === "expired") {
          setError(t.auth.codeExpired);
        } else {
          setError(t.auth.invalidCode);
        }
        return;
      }

      router.push("/");
    } catch {
      setError(t.auth.networkRequired);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-0 px-6">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <BtikiLogo size={72} showText={false} />
        <h1 className="font-display font-black text-4xl text-brand tracking-wide">
          B&apos;TIKI
        </h1>
      </div>

      {step === "phone" ? (
        <div className="w-full max-w-sm flex flex-col gap-4">
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
            type="button"
            variant="primary"
            size="lg"
            disabled={!phone.trim() || loading}
            className="mt-2"
            onClick={() => handleSendOtp("whatsapp")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-2 inline-block"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {loading ? t.common.loading : t.auth.sendViaWhatsapp}
          </Button>

          <button
            type="button"
            disabled={!phone.trim() || loading}
            onClick={() => handleSendOtp("sms")}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer disabled:opacity-50"
          >
            {t.auth.sendViaSms}
          </button>

          {/* Demo mode */}
          <div className="pt-4 border-t border-surface-3/30">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  enterDemoMode();
                  await seedDemoData();
                  router.push("/");
                } catch {
                  exitDemoMode();
                  setError(t.common.error);
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full text-sm text-brand font-medium hover:text-brand-light transition-colors cursor-pointer disabled:opacity-50"
            >
              {t.auth.tryDemo}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerifyOtp} className="w-full max-w-sm flex flex-col gap-4">
          <p className="text-sm text-text-secondary text-center">
            {channel === "whatsapp" ? t.auth.codeSentWhatsapp : t.auth.codeSentSms}
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
