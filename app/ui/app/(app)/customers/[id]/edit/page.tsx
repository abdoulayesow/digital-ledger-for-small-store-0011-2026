"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useFormSubmit } from "@/lib/hooks/use-form-submit";
import { useCustomer, updateCustomer, deleteCustomer } from "@/lib/hooks/use-customers";
import { parsePhone } from "@/lib/utils/phone";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { IconTrash } from "@/components/icons";

export default function EditCustomerPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const customerId = params.id;
  const customer = useCustomer(customerId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Pre-populate from customer data (once only — don't reset on sync updates)
  const initialized = useRef(false);
  useEffect(() => {
    if (customer && !initialized.current) {
      initialized.current = true;
      setName(customer.name);
      setPhone(customer.phone ?? "");
    }
  }, [customer]);

  const handleSave = useCallback(async () => {
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

    await updateCustomer(customerId, {
      name: name.trim(),
      phone: normalizedPhone,
    });
    router.push(`/customers/${customerId}`);
  }, [name, phone, customerId, router]);

  const { submit, saving, error } = useFormSubmit(handleSave, {
    onError: (err) =>
      err instanceof Error && err.message === "invalid_phone"
        ? t.auth.enterPhone
        : t.common.error,
  });

  const handleDeleteFn = useCallback(async () => {
    await deleteCustomer(customerId);
    router.push("/customers");
  }, [customerId, router]);

  const { submit: submitDelete, saving: deleting } = useFormSubmit(handleDeleteFn, {
    onError: () => t.common.error,
  });

  if (!customer) {
    return (
      <div className="flex flex-col">
        <PageHeader title={t.common.loading} showBack />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader title={t.customers.editCustomer} showBack />

      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="px-4 flex flex-col gap-5 pt-2 pb-6"
      >
        {/* Avatar preview — large, centered, with subtle ring */}
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="relative">
            <div className="ring-2 ring-surface-3/40 ring-offset-2 ring-offset-surface-0 rounded-full">
              <Avatar name={name || customer.name} size="lg" />
            </div>
          </div>
          <p className="text-xs text-text-muted font-medium tracking-wide uppercase mt-1">
            {name.trim() ? name.trim() : customer.name}
          </p>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4 bg-surface-1 rounded-2xl p-4 border border-surface-3/20">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
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
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
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
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-debt/10 border border-debt/20">
            <p className="text-sm text-debt font-medium">{error}</p>
          </div>
        )}

        {/* Save */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!name.trim() || saving}
          className="mt-2"
        >
          {saving ? t.common.loading : t.common.save}
        </Button>

        {/* Delete — visually separated, bottom of page */}
        <div className="pt-4 mt-2 border-t border-surface-3/20">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 min-h-12 text-sm text-debt/70 hover:text-debt active:bg-debt/5 rounded-xl transition-colors cursor-pointer"
          >
            <IconTrash size={16} />
            {t.common.delete}
          </button>
        </div>
      </form>

      {/* Delete confirmation modal */}
      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t.common.confirm}
      >
        <div className="flex flex-col gap-5 py-3">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-debt/10 flex items-center justify-center">
              <IconTrash size={22} className="text-debt" />
            </div>
            <p className="text-sm text-text-secondary text-center leading-relaxed">
              {t.customers.deleteConfirm}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowDeleteConfirm(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={submitDelete}
              disabled={deleting}
            >
              {deleting ? t.common.loading : t.common.delete}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
