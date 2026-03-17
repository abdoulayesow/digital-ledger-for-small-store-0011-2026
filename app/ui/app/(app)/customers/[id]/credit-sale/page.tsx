"use client";

import { useI18n } from "@/lib/hooks/use-i18n";
import { recordCreditSale } from "@/lib/hooks/use-sales";
import { RecordSaleForm } from "@/components/sale/RecordSaleForm";

export default function RecordCreditSalePage() {
  const { t } = useI18n();
  return (
    <RecordSaleForm
      mode={{
        recordFn: recordCreditSale,
        title: t.sales.addCreditSale,
        successMessage: t.sales.creditSaleRecorded,
        amountType: "debt",
        accentBg: "bg-debt/20",
        accentText: "text-debt",
        buttonVariant: "debt",
      }}
    />
  );
}
