"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useFormSubmit } from "@/lib/hooks/use-form-submit";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";
import { useUndoSale } from "@/lib/hooks/use-undo-sale";
import { createSale } from "@/lib/db/sales";
import { PageHeader } from "@/components/layout/PageHeader";
import { AmountPicker } from "@/components/sale/AmountPicker";
import { IconCoin } from "@/components/icons";

export default function QuickCashSalePage() {
  const { t } = useI18n();
  const router = useRouter();
  const retailerId = useRetailerId();
  const { setUndoableSale } = useUndoSale();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleConfirm = useCallback(async () => {
    if (!selectedAmount) return;
    const sale = await createSale({
      retailerId,
      customerId: null,
      type: "cash",
      amount: selectedAmount,
    });
    setUndoableSale({ saleId: sale.id, amount: sale.amount, type: sale.type });
    router.push("/");
  }, [selectedAmount, retailerId, setUndoableSale, router]);

  const { submit, saving, error } = useFormSubmit(handleConfirm, {
    onError: () => t.common.error,
  });

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
            onConfirm={submit}
          />
        </div>

        {error && <p className="text-sm text-debt text-center">{error}</p>}
      </div>
    </div>
  );
}
