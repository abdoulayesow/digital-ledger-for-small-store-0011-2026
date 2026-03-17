"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";
import { createSale } from "@/lib/db/sales";
import { PageHeader } from "@/components/layout/PageHeader";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { AmountPicker } from "@/components/sale/AmountPicker";
import { Button } from "@/components/ui/Button";
import { IconCheck, IconCoin } from "@/components/icons";

export default function QuickCashSalePage() {
  const { t } = useI18n();
  const router = useRouter();
  const retailerId = useRetailerId();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [savedAmount, setSavedAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  useEffect(() => {
    if (done) {
      const id = setTimeout(() => router.push("/"), 1200);
      return () => clearTimeout(id);
    }
  }, [done, router]);

  async function handleConfirm() {
    if (submitting.current) return;
    if (!selectedAmount || saving) return;

    submitting.current = true;
    setSaving(true);
    setError(null);
    try {
      await createSale({
        retailerId,
        customerId: null,
        type: "cash",
        amount: selectedAmount,
      });
      setSavedAmount(selectedAmount);
      setDone(true);
    } catch {
      setError(t.common.error);
    } finally {
      setSaving(false);
      submitting.current = false;
    }
  }

  /* ── Success state ── */
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-6">
        {/* Pulsing gold ring */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center">
            <IconCheck size={40} className="text-brand" />
          </div>
        </div>
        <p className="text-lg font-semibold text-text-primary">
          {t.sales.cashSaleRecorded}
        </p>
        <AmountDisplay amount={savedAmount} type="neutral" size="lg" />
      </div>
    );
  }

  /* ── Main sale flow ── */
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title={t.sales.quickSale} showBack />

      <div className="px-4 flex flex-col gap-5 pb-6 flex-1">
        {/* Hero coin icon */}
        <div className="flex flex-col items-center pt-2 pb-1">
          <div className="w-16 h-16 rounded-full bg-brand/10 border-2 border-brand/30 flex items-center justify-center mb-3">
            <IconCoin size={32} className="text-brand" />
          </div>
          <p className="text-sm text-text-secondary text-center">
            {t.sales.addCashSale}
          </p>
        </div>

        {/* Amount picker */}
        <div>
          <p className="text-sm font-medium text-text-secondary mb-2">
            {t.sales.amount}
          </p>
          <AmountPicker
            selectedAmount={selectedAmount}
            onSelect={setSelectedAmount}
          />
        </div>

        {error && <p className="text-sm text-debt text-center">{error}</p>}

        {/* Confirm section — sticks to bottom */}
        <div className="flex flex-col items-center gap-3 mt-auto pt-4">
          {selectedAmount && (
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-0.5 rounded-full bg-brand/40 mb-1" />
              <AmountDisplay amount={selectedAmount} type="neutral" size="lg" />
            </div>
          )}
          <Button
            variant="primary"
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
