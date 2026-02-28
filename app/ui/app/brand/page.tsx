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
import { Modal } from "@/components/ui/Modal";

/* ── Data ──────────────────────────────────────────────── */

const SURFACE_COLORS = [
  { name: "surface-0", hex: "#0C0A09", cls: "bg-surface-0" },
  { name: "surface-1", hex: "#1C1917", cls: "bg-surface-1" },
  { name: "surface-2", hex: "#292524", cls: "bg-surface-2" },
  { name: "surface-3", hex: "#44403C", cls: "bg-surface-3" },
];

const TEXT_COLORS = [
  { name: "primary", hex: "#FAFAF9", cls: "bg-text-primary" },
  { name: "secondary", hex: "#A8A29E", cls: "bg-text-secondary" },
  { name: "muted", hex: "#78716C", cls: "bg-text-muted" },
];

const BRAND_COLORS = [
  { name: "brand", hex: "#F59E0B", cls: "bg-brand" },
  { name: "brand-light", hex: "#FCD34D", cls: "bg-brand-light" },
  { name: "brand-dark", hex: "#D97706", cls: "bg-brand-dark" },
];

const SEMANTIC_COLORS = [
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
  { name: "Chevron", Icon: IconChevronRight },
  { name: "Check", Icon: IconCheck },
  { name: "Close", Icon: IconX },
  { name: "Coin", Icon: IconCoin },
  { name: "Debt", Icon: IconDebt },
  { name: "Payment", Icon: IconPayment },
  { name: "WhatsApp", Icon: IconWhatsApp },
  { name: "Offline", Icon: IconOffline },
  { name: "Online", Icon: IconOnline },
  { name: "Sync", Icon: IconSync },
];

/* ── Helpers ───────────────────────────────────────────── */

function SectionNumber({ n }: { n: string }) {
  return (
    <span className="font-[family-name:var(--font-display)] font-black text-[64px] leading-none text-brand/10 select-none pointer-events-none absolute -top-2 -left-1">
      {n}
    </span>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="relative pt-6 pb-4">
      <SectionNumber n={number} />
      <div className="relative z-10 pl-10">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-lg text-text-primary">
          {title}
        </h2>
        <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function GoldRule() {
  return (
    <div className="my-8 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
      <div className="w-1.5 h-1.5 rotate-45 bg-brand/40" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
    </div>
  );
}

function ColorSwatch({ name, hex, cls }: { name: string; hex: string; cls: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-16 rounded-xl border border-surface-3/30 ${cls}`} />
      <span className="text-[11px] font-medium text-text-secondary truncate">{name}</span>
      <span className="text-[10px] text-text-muted/60 font-mono">{hex}</span>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */

export default function BrandPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-0 relative overflow-x-hidden">

      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--brand) 1px, transparent 1px), linear-gradient(90deg, var(--brand) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ─── HERO ─────────────────────────────────── */}
      <header className="relative px-6 pt-14 pb-10">
        {/* Radial glow behind logo */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <LogoMark size={72} />
          <div className="mt-5">
            <h1 className="font-[family-name:var(--font-display)] font-black text-3xl text-text-primary tracking-tight">
              Déftar
            </h1>
            <p className="text-sm text-text-muted mt-1 tracking-widest uppercase">
              Brand &amp; Design System
            </p>
          </div>

          {/* Tagline bar */}
          <div className="mt-6 flex items-center gap-3 text-text-muted text-xs">
            <span className="h-px w-8 bg-brand/40" />
            <span className="tracking-wider uppercase">Le carnet digital</span>
            <span className="h-px w-8 bg-brand/40" />
          </div>
        </div>
      </header>

      <div className="px-6 pb-24 relative z-10">

        {/* ─── 01 LOGO ────────────────────────────── */}
        <GoldRule />
        <SectionHeader number="01" title="Logotype" subtitle="Primary mark, wordmark, and symbol" />

        <div className="space-y-4">
          {/* Full logo on dark */}
          <div className="bg-surface-1 rounded-2xl border border-surface-3/30 p-6 flex items-center justify-center">
            <DeftarLogo size={56} />
          </div>

          {/* Logo variations */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-1 rounded-xl border border-surface-3/30 p-4 flex flex-col items-center gap-3">
              <DeftarLogo size={32} />
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Small</span>
            </div>
            <div className="bg-surface-1 rounded-xl border border-surface-3/30 p-4 flex flex-col items-center gap-3">
              <LogoMark size={40} />
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Symbol</span>
            </div>
          </div>

          {/* Logo on light background */}
          <div className="bg-text-primary rounded-2xl p-6 flex items-center justify-center">
            <DeftarLogo size={48} className="[&_span]:!text-surface-0" />
          </div>
          <p className="text-[10px] text-text-muted text-center uppercase tracking-wider">Inverted on light surfaces</p>
        </div>

        {/* ─── 02 COLORS ─────────────────────────── */}
        <GoldRule />
        <SectionHeader number="02" title="Color Palette" subtitle="Warm stone surfaces with market gold accents" />

        {/* Surfaces */}
        <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-2 mt-2">
          Surfaces
        </p>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {SURFACE_COLORS.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>

        {/* Text */}
        <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-2">
          Text
        </p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {TEXT_COLORS.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>

        {/* Brand */}
        <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-2">
          Brand &mdash; Market Gold
        </p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {BRAND_COLORS.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>

        {/* Semantic */}
        <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-2">
          Semantic
        </p>
        <div className="grid grid-cols-5 gap-2">
          {SEMANTIC_COLORS.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>

        {/* ─── 03 TYPOGRAPHY ──────────────────────── */}
        <GoldRule />
        <SectionHeader number="03" title="Typography" subtitle="Nunito display, Noto Sans body, Pular support" />

        <Card className="!p-0 overflow-hidden">
          {/* Display font */}
          <div className="p-5 border-b border-surface-3/30">
            <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-3">
              Display &mdash; Nunito
            </p>
            <p className="font-[family-name:var(--font-display)] font-bold text-2xl text-text-primary leading-tight">
              Déftar &mdash; Votre carnet digital
            </p>
            <div className="mt-3 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] text-text-muted w-8 shrink-0">700</span>
                <span className="font-[family-name:var(--font-display)] font-bold text-lg text-text-secondary">Bold</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] text-text-muted w-8 shrink-0">800</span>
                <span className="font-[family-name:var(--font-display)] font-extrabold text-lg text-text-secondary">Extra Bold</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] text-text-muted w-8 shrink-0">900</span>
                <span className="font-[family-name:var(--font-display)] font-black text-lg text-text-secondary">Black</span>
              </div>
            </div>
          </div>

          {/* Body font */}
          <div className="p-5 border-b border-surface-3/30">
            <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-3">
              Body &mdash; Noto Sans
            </p>
            <p className="text-base font-normal text-text-primary">
              Le carnet digital pour boutiquiers guinéens
            </p>
            <div className="mt-3 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] text-text-muted w-8 shrink-0">400</span>
                <span className="text-base font-normal text-text-secondary">Regular</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] text-text-muted w-8 shrink-0">500</span>
                <span className="text-base font-medium text-text-secondary">Medium</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] text-text-muted w-8 shrink-0">600</span>
                <span className="text-base font-semibold text-text-secondary">Semibold</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] text-text-muted w-8 shrink-0">700</span>
                <span className="text-base font-bold text-text-secondary">Bold</span>
              </div>
            </div>
          </div>

          {/* Pular */}
          <div className="p-5">
            <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-3">
              Pular Hook Letters
            </p>
            <p className="text-2xl text-text-primary tracking-wider">
              ɓ &nbsp; ɗ &nbsp; ƴ &nbsp; &mdash; &nbsp; Ɓ &nbsp; Ɗ &nbsp; Ƴ
            </p>
            <p className="text-xs text-text-muted mt-2">
              Noto Sans includes full Latin Extended-B coverage for Pular/Fulfulde script
            </p>
          </div>
        </Card>

        {/* ─── 04 ICONOGRAPHY ────────────────────── */}
        <GoldRule />
        <SectionHeader number="04" title="Iconography" subtitle="18 custom SVG icons, 24px grid, 2px stroke" />

        <div className="grid grid-cols-6 gap-x-2 gap-y-4">
          {ICONS.map(({ name, Icon }) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-xl bg-surface-1 border border-surface-3/30 flex items-center justify-center text-text-primary transition-colors hover:border-brand/40 hover:text-brand">
                <Icon size={24} />
              </div>
              <span className="text-[9px] text-text-muted text-center leading-tight">{name}</span>
            </div>
          ))}
        </div>

        {/* ─── 05 BUTTONS ────────────────────────── */}
        <GoldRule />
        <SectionHeader number="05" title="Buttons" subtitle="6 variants, 3 sizes, touch targets 48dp+" />

        <div className="space-y-5">
          {/* Variants */}
          <div>
            <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-3">
              Variants
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="debt">Debt</Button>
              <Button variant="payment">Payment</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-3">
              Sizes
            </p>
            <div className="flex flex-wrap gap-2 items-end">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* States */}
          <div>
            <p className="text-[10px] text-brand uppercase tracking-[0.15em] font-semibold mb-3">
              States
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <Button variant="primary">Default</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>
        </div>

        {/* ─── 06 CARDS ──────────────────────────── */}
        <GoldRule />
        <SectionHeader number="06" title="Cards" subtitle="Content containers with optional interactivity" />

        <div className="space-y-3">
          <Card>
            <p className="text-text-primary font-semibold">Static Card</p>
            <p className="text-sm text-text-secondary mt-1">Surface-1, rounded-2xl, subtle border</p>
          </Card>
          <Card onClick={() => setModalOpen(true)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary font-semibold">Interactive Card</p>
                <p className="text-sm text-text-secondary mt-0.5">Tap to open modal demo</p>
              </div>
              <IconChevronRight size={20} className="text-text-muted" />
            </div>
          </Card>
        </div>

        {/* ─── 07 AVATARS ────────────────────────── */}
        <GoldRule />
        <SectionHeader number="07" title="Avatars" subtitle="Auto-generated colors from customer names" />

        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <Avatar name="Fatoumata" size="sm" />
              <span className="text-[9px] text-text-muted">sm</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Avatar name="Mariama" size="md" />
              <span className="text-[9px] text-text-muted">md</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Avatar name="Kadiatou" size="lg" />
              <span className="text-[9px] text-text-muted">lg</span>
            </div>
          </div>

          {/* Name diversity */}
          <div className="flex items-center gap-3">
            <Avatar name="Aissatou" size="md" />
            <Avatar name="Binta" size="md" />
            <Avatar name="Djénaba" size="md" />
            <Avatar name="Mamadou" size="md" />
            <Avatar name="Ousmane" size="md" />
            <Avatar name="Souleymane" size="md" />
          </div>
          <p className="text-[10px] text-text-muted">Each name produces a unique, stable background color</p>
        </div>

        {/* ─── 08 BADGES ─────────────────────────── */}
        <GoldRule />
        <SectionHeader number="08" title="Badges" subtitle="Debt age coding: green, yellow, red" />

        <Card className="!p-5">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <Badge variant="green">&lt;7 jours</Badge>
              <span className="text-[9px] text-text-muted">Fresh</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Badge variant="yellow">7-14 jours</Badge>
              <span className="text-[9px] text-text-muted">Aging</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Badge variant="red">&gt;14 jours</Badge>
              <span className="text-[9px] text-text-muted">Overdue</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Badge variant="neutral">Neutre</Badge>
              <span className="text-[9px] text-text-muted">Default</span>
            </div>
          </div>
        </Card>

        {/* ─── 09 AMOUNTS ────────────────────────── */}
        <GoldRule />
        <SectionHeader number="09" title="Amount Display" subtitle="GNF formatting, semantic colors, 3 scales" />

        <Card className="!p-5 space-y-4">
          {/* Large */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Large</p>
            <div className="flex items-center gap-4">
              <AmountDisplay amount={25000} type="debt" size="lg" />
              <AmountDisplay amount={10000} type="payment" size="lg" />
              <AmountDisplay amount={5000} type="neutral" size="lg" />
            </div>
          </div>
          {/* Medium */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Medium</p>
            <div className="flex items-center gap-4">
              <AmountDisplay amount={2000} type="debt" size="md" />
              <AmountDisplay amount={1000} type="payment" size="md" />
            </div>
          </div>
          {/* Small */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Small</p>
            <div className="flex items-center gap-4">
              <AmountDisplay amount={500} type="debt" size="sm" />
              <AmountDisplay amount={500} type="payment" size="sm" />
            </div>
          </div>
        </Card>

        {/* ─── 10 SEARCH ─────────────────────────── */}
        <GoldRule />
        <SectionHeader number="10" title="Search Input" subtitle="Instant filter with clear action" />

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un client\u2026"
        />

        {/* ─── 11 ICON BUTTONS ───────────────────── */}
        <GoldRule />
        <SectionHeader number="11" title="Icon Buttons" subtitle="Circular touch targets, 3 semantic variants" />

        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center gap-1.5">
            <IconButton icon={<IconPlus />} label="Add" variant="default" />
            <span className="text-[9px] text-text-muted">Default</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <IconButton icon={<IconPlus />} label="Add" variant="brand" />
            <span className="text-[9px] text-text-muted">Brand</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <IconButton icon={<IconX />} label="Delete" variant="danger" />
            <span className="text-[9px] text-text-muted">Danger</span>
          </div>
        </div>

        {/* ─── 12 EMPTY STATE ────────────────────── */}
        <GoldRule />
        <SectionHeader number="12" title="Empty State" subtitle="Zero-data placeholder with optional action" />

        <Card className="!p-0 overflow-hidden">
          <EmptyState
            icon={<IconUsers />}
            title="Aucun client"
            description="Ajoutez votre premier client pour commencer"
            action={
              <Button variant="primary" size="sm">
                <IconPlus size={18} /> Ajouter
              </Button>
            }
          />
        </Card>

        {/* ─── 13 MODAL ──────────────────────────── */}
        <GoldRule />
        <SectionHeader number="13" title="Modal" subtitle="Bottom sheet with focus trap and backdrop" />

        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          Open Modal Demo
        </Button>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirmer le paiement"
          closeLabel="Fermer"
        >
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <Avatar name="Fatoumata" size="lg" />
              <div>
                <p className="text-text-primary font-semibold">Fatoumata Diallo</p>
                <p className="text-sm text-text-secondary">Solde: <AmountDisplay amount={15000} type="debt" size="sm" /></p>
              </div>
            </div>
            <div className="bg-surface-2 rounded-xl p-4 text-center">
              <AmountDisplay amount={5000} type="payment" size="lg" />
            </div>
            <Button variant="primary" className="w-full" size="lg" onClick={() => setModalOpen(false)}>
              <IconCheck size={20} /> Confirmer
            </Button>
          </div>
        </Modal>

        {/* ─── FOOTER ────────────────────────────── */}
        <GoldRule />
        <div className="text-center py-8">
          <LogoMark size={28} className="mx-auto opacity-30" />
          <p className="text-[10px] text-text-muted/50 mt-3 uppercase tracking-[0.2em]">
            Déftar Design System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
