'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './i18n';

const DEFAULT_LANG = 'ar';
const LANG_STORAGE_KEY = 'mlPreferredLang';

const LangContext = createContext({ lang: DEFAULT_LANG, t: (k) => k, setLang: () => {}, dir: 'rtl' });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [preferenceReady, setPreferenceReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    if (queryLang === 'ar' || queryLang === 'en') {
      setLang(queryLang);
      try { localStorage.setItem(LANG_STORAGE_KEY, queryLang); } catch {}
    } else {
      try {
        const stored = localStorage.getItem(LANG_STORAGE_KEY);
        if (stored === 'ar' || stored === 'en') setLang(stored);
        localStorage.removeItem('lang');
      } catch {}
    }
    setPreferenceReady(true);
  }, []);

  useEffect(() => {
    if (preferenceReady && typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch {}
    }
  }, [lang, preferenceReady]);

  const t = (key) => (translations[lang] && translations[lang][key]) || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
