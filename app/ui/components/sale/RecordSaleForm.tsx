"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/hooks/use-i18n";
import { useFormSubmit } from "@/lib/hooks/use-form-submit";
import { useCustomer } from "@/lib/hooks/use-customers";
import { useCustomerBalance } from "@/lib/hooks/use-balance";
import { useUndoSale } from "@/lib/hooks/use-undo-sale";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { AmountPicker } from "@/components/sale/AmountPicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { useRetailerId } from "@/lib/hooks/use-retailer-id";
import { NOTE_MAX_LENGTH } from "@/lib/constants";
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
  const { setUndoableSale } = useUndoSale();

  const customer = useCustomer(customerId);
  const balance = useCustomerBalance(retailerId, customerId);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const handleConfirm = useCallback(async () => {
    if (!selectedAmount || !retailerId) return;
    const sale = await mode.recordFn(retailerId, customerId, selectedAmount, note.trim() || null);
    setUndoableSale({ saleId: sale.id, amount: sale.amount, type: sale.type });
    router.push(`/customers/${customerId}`);
  }, [selectedAmount, retailerId, customerId, note, mode, setUndoableSale, router]);

  const { submit, saving, error, clearError } = useFormSubmit(handleConfirm, {
    onError: () => t.common.error,
  });

  // Clear error when amount changes
  useEffect(() => {
    clearError();
  }, [selectedAmount, clearError]);

  if (!customer) {
    return (
      <div className="flex flex-col">
        <PageHeader title={t.common.loading} showBack />
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
          <TextInput
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={NOTE_MAX_LENGTH}
            placeholder={t.sales.note}
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
            onClick={submit}
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
