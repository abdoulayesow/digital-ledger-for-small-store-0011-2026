"use client";

import { useI18n } from "@/lib/hooks/use-i18n";
import type { Language } from "@/lib/db/schema";
import { getLanguageLabel } from "@/lib/i18n";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { IconCheck } from "@/components/icons";
import { DeftarLogo } from "@/components/brand/DeftarLogo";
import { clearSessionCache } from "@/lib/hooks/use-session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";

const LANGUAGES: Language[] = ["fr", "su", "ff", "man"];

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="flex flex-col">
      <PageHeader title={t.nav.settings} />

      <div className="px-4 flex flex-col gap-6 pb-4">
        {/* Language selection */}
        <div>
          <h2
            className="text-sm font-semibold text-text-secondary mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.settings.chooseLanguage}
          </h2>
          <ul className="flex flex-col gap-2">
            {LANGUAGES.map((code) => (
              <li key={code}>
                <Card
                  onClick={() => setLang(code)}
                  className={[
                    "flex items-center justify-between",
                    lang === code ? "border-brand" : "",
                  ].join(" ")}
                >
                  <span className="text-text-primary font-medium">
                    {getLanguageLabel(code)}
                  </span>
                  {lang === code && (
                    <IconCheck size={20} className="text-brand" />
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h2
            className="text-sm font-semibold text-text-secondary mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.settings.about}
          </h2>
          <Card className="flex flex-col items-center gap-3 py-6">
            <DeftarLogo size={48} />
            <p className="text-sm text-text-muted">v0.1.0</p>
            <p className="text-xs text-text-muted text-center max-w-xs">
              Carnet digital pour boutiquiers — Digital ledger for small retailers
            </p>
          </Card>
        </div>

        {/* Logout */}
        <Button
          variant="danger"
          size="lg"
          className="w-full"
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
            } catch {
              // Offline — clear local state anyway
            }
            clearSessionCache();
            await db.delete();
            window.location.href = "/login";
          }}
        >
          {t.auth.logout}
        </Button>
      </div>
    </div>
  );
}
