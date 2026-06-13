'use client';

import React from 'react';

export default function FormProgress({ step, total, label, title, desc }) {
  return (
    <section className="mb-5 rounded-3xl border border-border bg-white p-5 shadow-card motion-fade-up">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: '#D0F2EE', color: '#0B6E60' }}>
          {label} {step}/{total}
        </span>
        <span className="text-[11px] font-bold text-muted-foreground">
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div className="mb-4 flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const done = n <= step;
          return (
            <div
              key={n}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${done ? 'progress-live' : ''}`}
              style={done
                ? { background: 'linear-gradient(90deg, #12C3AA, #0BA890)' }
                : { background: 'hsl(var(--muted))' }}
            />
          );
        })}
      </div>
      <h2 className="display-title text-[19px] leading-tight">{title}</h2>
      {desc && <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>}
    </section>
  );
}
