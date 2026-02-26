"use client";

import { useState, useEffect, useCallback } from "react";
import type { Translations } from "../i18n/types";
import type { Language } from "../db/schema";
import {
  getStoredLanguage,
  setStoredLanguage,
  getTranslations,
} from "../i18n";

interface UseI18nReturn {
  t: Translations;
  lang: Language;
  setLang: (lang: Language) => void;
}

export function useI18n(): UseI18nReturn {
  const [lang, setLangState] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    setStoredLanguage(newLang);
    setLangState(newLang);
  }, []);

  return { t: getTranslations(lang), lang, setLang };
}
