"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/hooks/use-i18n";

/** All-language fallback shown before JS hydrates */
const FALLBACK_MESSAGES = [
  { title: "Hors connexion", message: "Vos données sont sauvegardées localement." },
  { title: "Nɛti mu na", message: "I xa kumpanyi ragataxi i xa telefon kui." },
  { title: "Alaa ceŋol", message: "Keɓe maa mooftaama e telefon maa." },
  { title: "Rezo tɛ", message: "I ka kunafoniw maralenw bɛ i ka telefoni kɔnɔ." },
];

function WifiOffIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted"
      aria-hidden="true"
    >
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
      <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
      <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
      <path d="M5 12.86a10 10 0 0 1 5.17-2.89" />
      <circle cx="12" cy="20" r="1" />
    </svg>
  );
}

export default function OfflinePage() {
  const [hydrated, setHydrated] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setHydrated(true); // eslint-disable-line react-hooks/set-state-in-effect -- hydration flag
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 bg-background text-text-primary">
      <WifiOffIcon />

      {hydrated ? (
        <>
          <h1 className="text-2xl font-bold text-center">{t.offline.title}</h1>
          <p className="text-base text-text-muted text-center max-w-xs">
            {t.offline.message}
          </p>
        </>
      ) : (
        <div className="space-y-4 text-center">
          {FALLBACK_MESSAGES.map(({ title, message }) => (
            <div key={title}>
              <p className="text-lg font-semibold">{title}</p>
              <p className="text-sm text-text-muted">{message}</p>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="min-h-12 px-6 rounded-xl bg-brand text-white text-base font-semibold cursor-pointer"
      >
        {hydrated ? t.common.retry : "↻"}
      </button>
    </main>
  );
}
