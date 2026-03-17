"use client";

import { useI18n } from "@/lib/hooks/use-i18n";
import { recordCashSale } from "@/lib/hooks/use-sales";
import { RecordSaleForm } from "@/components/sale/RecordSaleForm";

export default function RecordCashSalePage() {
  const { t } = useI18n();
  return (
    <RecordSaleForm
      mode={{
        recordFn: recordCashSale,
        title: t.sales.addCashSale,
        successMessage: t.sales.cashSaleRecorded,
        amountType: "neutral",
        accentBg: "bg-brand/20",
        accentText: "text-brand",
        buttonVariant: "primary",
      }}
    />
  );
}
