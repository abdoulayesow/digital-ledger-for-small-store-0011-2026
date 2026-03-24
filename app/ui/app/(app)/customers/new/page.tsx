"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useFormSubmit } from "@/lib/hooks/use-form-submit";
import { createCustomer } from "@/lib/hooks/use-customers";
import { parsePhone } from "@/lib/utils/phone";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";

export default function NewCustomerPage() {
  const { t } = useI18n();
  const router = useRouter();
  const retailerId = useRetailerId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const handleCreate = useCallback(async () => {
    if (!name.trim()) return;

    const rawPhone = phone.trim();
    let normalizedPhone: string | null = null;
    if (rawPhone) {
      normalizedPhone = parsePhone(rawPhone);
      if (!normalizedPhone) {
        setPhoneError(true);
        throw new Error("invalid_phone");
      }
    }

    await createCustomer({
      retailerId,
      name: name.trim(),
      phone: normalizedPhone,
    });
    router.push("/customers");
  }, [name, phone, retailerId, router]);

  const { submit, saving, error } = useFormSubmit(handleCreate, {
    onError: (err) =>
      err instanceof Error && err.message === "invalid_phone"
        ? t.auth.enterPhone
        : t.common.error,
  });

  return (
    <div className="flex flex-col">
      <PageHeader title={t.customers.addCustomer} showBack />

      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="px-4 flex flex-col gap-4 pt-4"
      >
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            {t.customers.customerName}
          </label>
          <TextInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.customers.customerName}
            autoFocus
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            {t.customers.phoneOptional}
          </label>
          <TextInput
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setPhoneError(false); }}
            placeholder="+224 6XX XX XX XX"
            error={phoneError}
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
