"use client";

import { useState } from "react";
import { DeftarLogo } from "@/components/brand/DeftarLogo";
import { LogoMark } from "@/components/brand/LogoMark";
import {
  IconHome, IconUsers, IconBell, IconSettings, IconPlus, IconMinus,
  IconSearch, IconArrowLeft, IconChevronRight, IconCheck, IconX,
  IconCoin, IconDebt, IconPayment, IconWhatsApp, IconOffline, IconOnline, IconSync,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";

const sectionHeading = "font-[family-name:var(--font-display)] font-bold text-xl text-brand mb-4 mt-10";

const COLORS = [
  { name: "surface-0", hex: "#0C0A09", cls: "bg-surface-0" },
  { name: "surface-1", hex: "#1C1917", cls: "bg-surface-1" },
  { name: "surface-2", hex: "#292524", cls: "bg-surface-2" },
  { name: "surface-3", hex: "#44403C", cls: "bg-surface-3" },
  { name: "text-primary", hex: "#FAFAF9", cls: "bg-text-primary" },
  { name: "text-secondary", hex: "#A8A29E", cls: "bg-text-secondary" },
  { name: "text-muted", hex: "#78716C", cls: "bg-text-muted" },
  { name: "brand", hex: "#F59E0B", cls: "bg-brand" },
  { name: "brand-light", hex: "#FCD34D", cls: "bg-brand-light" },
  { name: "brand-dark", hex: "#D97706", cls: "bg-brand-dark" },
  { name: "debt", hex: "#EF4444", cls: "bg-debt" },
  { name: "payment", hex: "#22C55E", cls: "bg-payment" },
  { name: "age-green", hex: "#22C55E", cls: "bg-age-green" },
  { name: "age-yellow", hex: "#EAB308", cls: "bg-age-yellow" },
  { name: "age-red", hex: "#EF4444", cls: "bg-age-red" },
];

const ICONS = [
  { name: "Home", Icon: IconHome },
  { name: "Users", Icon: IconUsers },
  { name: "Bell", Icon: IconBell },
  { name: "Settings", Icon: IconSettings },
  { name: "Plus", Icon: IconPlus },
  { name: "Minus", Icon: IconMinus },
  { name: "Search", Icon: IconSearch },
  { name: "ArrowLeft", Icon: IconArrowLeft },
  { name: "ChevronRight", Icon: IconChevronRight },
  { name: "Check", Icon: IconCheck },
  { name: "X", Icon: IconX },
  { name: "Coin", Icon: IconCoin },
  { name: "Debt", Icon: IconDebt },
  { name: "Payment", Icon: IconPayment },
  { name: "WhatsApp", Icon: IconWhatsApp },
  { name: "Offline", Icon: IconOffline },
  { name: "Online", Icon: IconOnline },
  { name: "Sync", Icon: IconSync },
];

export default function BrandPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-surface-0 p-6 pb-24">
      <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl text-text-primary mb-2">
        Déftar Design System
      </h1>
      <p className="text-text-secondary text-sm mb-6">Brand identity, tokens, and component reference</p>

      {/* Logo */}
      <h2 className={sectionHeading}>Logo</h2>
      <div className="flex flex-wrap items-end gap-6 p-6 bg-surface-1 rounded-2xl border border-surface-3/50">
        <DeftarLogo size={32} />
        <DeftarLogo size={48} />
        <DeftarLogo size={64} />
        <LogoMark size={48} />
        <LogoMark size={32} />
      </div>

      {/* Colors */}
      <h2 className={sectionHeading}>Color Palette</h2>
      <div className="grid grid-cols-3 gap-3">
        {COLORS.map((c) => (
          <div key={c.name} className="flex flex-col items-center gap-1">
            <div
              className={`w-full h-14 rounded-xl border border-surface-3/50 ${c.cls}`}
            />
            <span className="text-xs text-text-muted">{c.name}</span>
            <span className="text-xs text-text-muted/60 font-mono">{c.hex}</span>
          </div>
        ))}
      </div>

      {/* Typography */}
      <h2 className={sectionHeading}>Typography</h2>
      <Card>
        <p className="text-xs text-text-muted mb-3">Display — Nunito</p>
        <p className="font-[family-name:var(--font-display)] font-bold text-2xl text-text-primary">
          Déftar — Votre carnet digital
        </p>
        <p className="font-[family-name:var(--font-display)] font-extrabold text-xl text-text-secondary mt-1">
          800 weight
        </p>
        <p className="font-[family-name:var(--font-display)] font-black text-lg text-text-muted mt-1">
          900 weight
        </p>
        <hr className="border-surface-3/50 my-4" />
        <p className="text-xs text-text-muted mb-3">Body — Noto Sans</p>
        <p className="text-base font-normal text-text-primary">Regular 400 — Le carnet digital pour boutiquiers</p>
        <p className="text-base font-medium text-text-primary mt-1">Medium 500</p>
        <p className="text-base font-semibold text-text-primary mt-1">Semibold 600</p>
        <p className="text-base font-bold text-text-primary mt-1">Bold 700</p>
        <hr className="border-surface-3/50 my-4" />
        <p className="text-xs text-text-muted mb-2">Pular hook letters</p>
        <p className="text-xl text-text-primary">ɓ ɗ ƴ — Ɓ Ɗ Ƴ</p>
      </Card>

      {/* Icons */}
      <h2 className={sectionHeading}>Icons</h2>
      <div className="grid grid-cols-6 gap-4">
        {ICONS.map(({ name, Icon }) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-xl bg-surface-1 border border-surface-3/50 flex items-center justify-center text-text-primary">
              <Icon size={24} />
            </div>
            <span className="text-[10px] text-text-muted text-center leading-tight">{name}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <h2 className={sectionHeading}>Buttons</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="debt">Debt</Button>
          <Button variant="payment">Payment</Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      {/* Card */}
      <h2 className={sectionHeading}>Card</h2>
      <Card>
        <p className="text-text-primary font-semibold">Content card</p>
        <p className="text-sm text-text-secondary mt-1">bg-surface-1, rounded-2xl, border</p>
      </Card>

      {/* Avatars */}
      <h2 className={sectionHeading}>Avatars</h2>
      <div className="flex items-end gap-4">
        <Avatar name="Fatoumata" size="sm" />
        <Avatar name="Mariama" size="md" />
        <Avatar name="Kadiatou" size="lg" />
        <Avatar name="Aissatou" size="md" />
        <Avatar name="Binta" size="md" />
        <Avatar name="Djénaba" size="md" />
      </div>

      {/* Badges */}
      <h2 className={sectionHeading}>Badges</h2>
      <div className="flex flex-wrap gap-2">
        <Badge variant="green">&lt;7 jours</Badge>
        <Badge variant="yellow">7-14 jours</Badge>
        <Badge variant="red">&gt;14 jours</Badge>
        <Badge variant="neutral">Neutre</Badge>
      </div>

      {/* Amount Display */}
      <h2 className={sectionHeading}>Amount Display</h2>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <AmountDisplay amount={25000} type="debt" size="lg" />
          <AmountDisplay amount={10000} type="payment" size="lg" />
          <AmountDisplay amount={5000} type="neutral" size="lg" />
        </div>
        <div className="flex items-center gap-4">
          <AmountDisplay amount={2000} type="debt" size="md" />
          <AmountDisplay amount={1000} type="payment" size="md" />
        </div>
        <div className="flex items-center gap-4">
          <AmountDisplay amount={500} type="debt" size="sm" />
          <AmountDisplay amount={500} type="payment" size="sm" />
        </div>
      </div>

      {/* Search Input */}
      <h2 className={sectionHeading}>Search Input</h2>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un client…"
      />

      {/* Icon Buttons */}
      <h2 className={sectionHeading}>Icon Buttons</h2>
      <div className="flex gap-3">
        <IconButton icon={<IconPlus />} label="Add" variant="default" />
        <IconButton icon={<IconPlus />} label="Add" variant="brand" />
        <IconButton icon={<IconX />} label="Delete" variant="danger" />
      </div>

      {/* Empty State */}
      <h2 className={sectionHeading}>Empty State</h2>
      <EmptyState
        icon={<IconUsers />}
        title="Aucun client"
        description="Ajoutez votre premier client pour commencer"
        action={<Button variant="primary" size="sm"><IconPlus size={18} /> Ajouter</Button>}
      />
    </div>
  );
}
