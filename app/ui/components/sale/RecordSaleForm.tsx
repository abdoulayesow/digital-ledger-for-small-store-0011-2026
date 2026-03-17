"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useCustomer } from "@/lib/hooks/use-customers";
import { useCustomerBalance } from "@/lib/hooks/use-balance";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { AmountPicker } from "@/components/sale/AmountPicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconCheck } from "@/components/icons";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";
import type { Sale } from "@/lib/db/schema";

type AmountType = "neutral" | "debt" | "payment";
type ButtonVariant = "primary" | "danger" | "debt" | "payment";

export interface SaleMode {
  recordFn: (retailerId: string, customerId: string, amount: number, note?: string | null) => Promise<Sale>;
  title: string;
  successMessage: string;
  amountType: AmountType;
  accentBg: string;
  accentText: string;
  buttonVariant: ButtonVariant;
}

export function RecordSaleForm({ mode }: { mode: SaleMode }) {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const customerId = params.id;
  const retailerId = useRetailerId();

  const customer = useCustomer(customerId);
  const balance = useCustomerBalance(retailerId, customerId);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [savedAmount, setSavedAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  // Auto-redirect after success
  useEffect(() => {
    if (done) {
      const id = setTimeout(() => router.push(`/customers/${customerId}`), 1200);
      return () => clearTimeout(id);
    }
  }, [done, router, customerId]);

  // Clear error when amount changes
  useEffect(() => {
    setError(null);
  }, [selectedAmount]);

  async function handleConfirm() {
    if (submitting.current) return;
    if (!selectedAmount || !retailerId || saving) return;

    submitting.current = true;
    setSaving(true);
    setError(null);
    try {
      await mode.recordFn(retailerId, customerId, selectedAmount, note.trim() || null);
      setSavedAmount(selectedAmount);
      setDone(true);
    } catch {
      setError(t.common.error);
    } finally {
      setSaving(false);
      submitting.current = false;
    }
  }

  if (!customer) {
    return (
      <div className="flex flex-col">
        <PageHeader title={t.common.loading} showBack />
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <div className={`w-20 h-20 rounded-full ${mode.accentBg} flex items-center justify-center`}>
          <IconCheck size={40} className={mode.accentText} />
        </div>
        <p className="text-lg font-semibold text-text-primary">{mode.successMessage}</p>
        <AmountDisplay amount={savedAmount} type={mode.amountType} size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader title={mode.title} showBack />

      <div className="px-4 flex flex-col gap-4 pb-4">
        {/* Customer info */}
        <Card className="flex items-center gap-3">
          <Avatar name={customer.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text-primary truncate">{customer.name}</p>
            {balance && (
              <p className="text-sm text-text-muted">
                {t.customers.totalOwed}: <AmountDisplay amount={balance.balance} type="debt" size="sm" />
              </p>
            )}
          </div>
        </Card>

        {/* Amount picker — tap 1 */}
        <div>
          <p className="text-sm font-medium text-text-secondary mb-2">
            {t.sales.amount}
          </p>
          <AmountPicker
            selectedAmount={selectedAmount}
            onSelect={setSelectedAmount}
          />
        </div>

        {/* Optional note */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-1.5">
            {t.sales.noteOptional}
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            placeholder={t.sales.note}
            className={[
              "w-full min-h-12 px-4 rounded-xl",
              "bg-surface-2 text-text-primary placeholder:text-text-muted",
              "border border-surface-3/50 focus:border-brand",
              "focus:outline-none text-base",
            ].join(" ")}
          />
        </div>

        {error && <p className="text-sm text-debt text-center">{error}</p>}

        {/* Selected amount preview + confirm — tap 2 */}
        <div className="flex flex-col items-center gap-3 py-2">
          {selectedAmount && (
            <AmountDisplay amount={selectedAmount} type={mode.amountType} size="lg" />
          )}
          <Button
            variant={mode.buttonVariant}
            size="lg"
            onClick={handleConfirm}
            disabled={!selectedAmount || saving}
            className="w-full"
          >
            {saving ? t.common.loading : t.common.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}
