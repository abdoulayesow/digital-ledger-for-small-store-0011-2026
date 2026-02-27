"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { createCustomer } from "@/lib/hooks/use-customers";
import { parsePhone } from "@/lib/utils/phone";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";

export default function NewCustomerPage() {
  const { t } = useI18n();
  const router = useRouter();
  const retailerId = useRetailerId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const rawPhone = phone.trim();
    let normalizedPhone: string | null = null;
    if (rawPhone) {
      normalizedPhone = parsePhone(rawPhone);
      if (!normalizedPhone) {
        setError(t.auth.enterPhone);
        return;
      }
    }

    setSaving(true);
    setError(null);
    try {
      await createCustomer({
        retailerId,
        name: name.trim(),
        phone: normalizedPhone,
      });
      router.push("/customers");
    } catch {
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col">
      <PageHeader title={t.customers.addCustomer} showBack />

      <form onSubmit={handleSubmit} className="px-4 flex flex-col gap-4 pt-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            {t.customers.customerName}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.customers.customerName}
            autoFocus
            className={[
              "min-h-12 px-4 rounded-xl",
              "bg-surface-2 text-text-primary placeholder:text-text-muted",
              "border border-surface-3/50 focus:border-brand",
              "focus:outline-none text-base",
            ].join(" ")}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            {t.customers.phoneOptional}
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+224 6XX XX XX XX"
            className={[
              "min-h-12 px-4 rounded-xl",
              "bg-surface-2 text-text-primary placeholder:text-text-muted",
              "border border-surface-3/50 focus:border-brand",
              "focus:outline-none text-base",
            ].join(" ")}
          />
        </div>

        {error && <p className="text-sm text-debt text-center">{error}</p>}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!name.trim() || saving}
          className="mt-4"
        >
          {saving ? t.common.loading : t.common.save}
        </Button>
      </form>
    </div>
  );
}
