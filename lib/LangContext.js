'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './i18n';

const LangContext = createContext({ lang: 'en', t: (k) => k, setLang: () => {}, dir: 'ltr' });

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    if (queryLang === 'ar' || queryLang === 'en') {
      setLang(queryLang);
      return;
    }
    const stored = localStorage.getItem('lang');
    if (stored === 'ar' || stored === 'en') setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      try { localStorage.setItem('lang', lang); } catch {}
    }
  }, [lang]);

  const t = (key) => (translations[lang] && translations[lang][key]) || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
