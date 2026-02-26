import type { Translations } from "./types";
import { fr } from "./fr";
import { su } from "./su";
import { ff } from "./ff";
import { man } from "./man";
import type { Language } from "../db/schema";

export type { Translations, Language };

const translations: Record<Language, Translations> = { su, ff, man, fr };

const LANGUAGE_LABELS: Record<Language, string> = {
  su: "Susu",
  ff: "Pular",
  man: "Malinké",
  fr: "Français",
};

const STORAGE_KEY = "deftar-language";
const DEFAULT_LANGUAGE: Language = "fr";

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in translations) return stored as Language;
  return DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang: Language): void {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function getLanguageLabel(lang: Language): string {
  return LANGUAGE_LABELS[lang];
}

export { LANGUAGE_LABELS, DEFAULT_LANGUAGE };
