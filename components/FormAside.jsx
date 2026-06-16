'use client';
import React from 'react';
import { useLang } from '@/lib/LangContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { ShieldCheck } from 'lucide-react';

/**
 * Sticky context panel shown beside multi-step forms on large screens.
 * Desktop/iPad-landscape only (hidden below lg) — reassures the user with a
 * "what happens next" mini-timeline, a privacy note, and a WhatsApp help CTA.
 */
export default function FormAside({ steps = [], note }) {
  const { t } = useLang();
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-3">
        <div className="rounded-[22px] border border-border bg-white p-5 shadow-soft">
          <h3 className="text-[13.5px] font-bold text-navy">{t('formAsideTitle')}</h3>
          <ol className="mt-4 space-y-4">
            {steps.map((s, i) => (
              <li key={i} className="relative flex gap-3">
                {i < steps.length - 1 && (
                  <span className="absolute top-7 h-[calc(100%-12px)] w-px bg-border" style={{ insetInlineStart: '11px' }} />
                )}
                <span
                  className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-soft"
                  style={{ background: 'linear-gradient(180deg, #12C3AA, #0BA890)' }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-bold text-navy leading-snug">{s.title}</div>
                  <div className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">{s.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {note && (
          <div className="flex items-start gap-2.5 rounded-[22px] border border-border bg-white p-4 shadow-soft">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#0EB59E' }} />
            <p className="text-[11.5px] leading-relaxed text-muted-foreground">{note}</p>
          </div>
        )}

        <a
          href="https://wa.me/97466259219"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline w-full text-[12.5px]"
          style={{ minHeight: 44 }}
        >
          <WhatsAppIcon className="h-[15px] w-[15px]" style={{ color: '#0EB59E' }} />
          {t('startWhatsapp')}
        </a>
      </div>
    </aside>
  );
}
