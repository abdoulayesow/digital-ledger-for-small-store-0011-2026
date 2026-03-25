"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { BtikiLogo } from "@/components/brand/BtikiLogo";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { enterDemoMode, exitDemoMode } from "@/lib/demo-session";
import { seedDemoData } from "@/lib/db/dev-seed";
import { PIN_LENGTH } from "@/lib/constants";

type Step = "phone" | "pin" | "create-pin" | "confirm-pin";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckPhone() {
    if (!phone.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      if (!res.ok) {
        setError(t.common.error);
        return;
      }

      const data = await res.json();
      setStep(data.exists ? "pin" : "create-pin");
    } catch {
      setError(!navigator.onLine ? t.common.connectionCheck : t.common.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== PIN_LENGTH) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), pin }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "account_locked") {
          setError(t.auth.accountLocked);
        } else if (data.error === "invalid_pin") {
          setError(t.auth.invalidPin);
        } else {
          setError(t.common.error);
        }
        setPin("");
        return;
      }

      router.push("/");
    } catch {
      setError(!navigator.onLine ? t.common.connectionCheck : t.common.error);
    } finally {
      setLoading(false);
    }
  }

  function handleCreatePinNext() {
    if (pin.length !== PIN_LENGTH) return;
    setError(null);
    setStep("confirm-pin");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (confirmPin.length !== PIN_LENGTH) return;

    if (pin !== confirmPin) {
      setError(t.auth.pinMismatch);
      setConfirmPin("");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), pin }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "phone_taken") {
          setError(t.auth.phoneTaken);
          setStep("pin");
          setPin("");
        } else {
          setError(t.common.error);
        }
        return;
      }

      router.push("/");
    } catch {
      setError(!navigator.onLine ? t.common.connectionCheck : t.common.error);
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    if (step === "confirm-pin") {
      setStep("create-pin");
      setConfirmPin("");
    } else {
      setStep("phone");
      setPin("");
      setConfirmPin("");
    }
    setError(null);
  }

  const pinInputProps = {
    type: "text" as const,
    inputMode: "numeric" as const,
    maxLength: PIN_LENGTH,
    autoFocus: true,
    variant: "centered" as const,
    style: { minHeight: "3.5rem", fontSize: "1.5rem", letterSpacing: "0.3em", fontFamily: "monospace" },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-0 px-6">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <BtikiLogo size={72} showText={false} />
        <h1 className="font-display font-black text-4xl text-brand tracking-wide">
          B&apos;TIKI
        </h1>
      </div>

      {step === "phone" && (
        <div className="w-full max-w-sm flex flex-col gap-4">
          <label className="text-sm font-medium text-text-secondary">
            {t.auth.phoneNumber}
          </label>
          <TextInput
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.auth.enterPhone}
            autoFocus
            variant="centered"
          />

          {error && <p className="text-sm text-debt text-center">{error}</p>}

          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={!phone.trim() || loading}
            className="mt-2"
            onClick={handleCheckPhone}
          >
            {loading ? t.common.loading : t.common.next}
          </Button>

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
                  setError(!navigator.onLine ? t.common.connectionCheck : t.common.error);
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
      )}

      {step === "pin" && (
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
          <p className="text-sm text-text-secondary text-center">
            {t.auth.enterPin}
          </p>
          <TextInput
            {...pinInputProps}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))}
            placeholder={"•".repeat(PIN_LENGTH)}
          />

          {error && <p className="text-sm text-debt text-center">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={pin.length < PIN_LENGTH || loading}
            className="mt-2"
          >
            {loading ? t.common.loading : t.common.confirm}
          </Button>

          <button type="button" onClick={goBack} className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
            {t.common.back}
          </button>
        </form>
      )}

      {step === "create-pin" && (
        <div className="w-full max-w-sm flex flex-col gap-4">
          <p className="text-sm text-text-secondary text-center">
            {t.auth.createPin}
          </p>
          <TextInput
            {...pinInputProps}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))}
            placeholder={"•".repeat(PIN_LENGTH)}
          />

          {error && <p className="text-sm text-debt text-center">{error}</p>}

          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={pin.length < PIN_LENGTH}
            className="mt-2"
            onClick={handleCreatePinNext}
          >
            {t.common.next}
          </Button>

          <button type="button" onClick={goBack} className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
            {t.common.back}
          </button>
        </div>
      )}

      {step === "confirm-pin" && (
        <form onSubmit={handleRegister} className="w-full max-w-sm flex flex-col gap-4">
          <p className="text-sm text-text-secondary text-center">
            {t.auth.confirmPin}
          </p>
          <TextInput
            {...pinInputProps}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))}
            placeholder={"•".repeat(PIN_LENGTH)}
          />

          {error && <p className="text-sm text-debt text-center">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={confirmPin.length < PIN_LENGTH || loading}
            className="mt-2"
          >
            {loading ? t.common.loading : t.common.confirm}
          </Button>

          <button type="button" onClick={goBack} className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
            {t.common.back}
          </button>
        </form>
      )}
    </div>
  );
}
