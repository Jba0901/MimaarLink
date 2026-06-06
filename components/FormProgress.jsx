'use client';

import React from 'react';

export default function FormProgress({ step, total, label, title, desc }) {
  return (
    <section className="mb-5 rounded-2xl border border-border bg-white p-4 shadow-soft motion-fade-up">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-navy">
          {label} {step}/{total}
        </span>
        <span className="text-[11px] font-semibold text-muted-foreground">
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div className="mb-4 flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          return (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${n <= step ? 'navy progress-live' : 'bg-secondary'}`}
            />
          );
        })}
      </div>
      <h2 className="text-[18px] font-bold leading-tight text-navy">{title}</h2>
      {desc && <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>}
    </section>
  );
}
