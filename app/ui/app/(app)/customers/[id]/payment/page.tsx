"use client";

import { useI18n } from "@/lib/hooks/use-i18n";
import { recordPayment } from "@/lib/hooks/use-sales";
import { RecordSaleForm } from "@/components/sale/RecordSaleForm";

export default function RecordPaymentPage() {
  const { t } = useI18n();
  return (
    <RecordSaleForm
      mode={{
        recordFn: recordPayment,
        title: t.sales.addPayment,
        successMessage: t.sales.paymentRecorded,
        amountType: "payment",
        accentBg: "bg-payment/20",
        accentText: "text-payment",
        buttonVariant: "primary",
      }}
    />
  );
}
