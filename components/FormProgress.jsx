'use client';

import React from 'react';

export default function FormProgress({ step, total, label, title, desc }) {
  return (
    <section
      className="mb-4 rounded-[20px] border border-border bg-card p-4 shadow-soft motion-fade-up sm:mb-5 sm:rounded-3xl sm:p-5 sm:shadow-card"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`${label} ${step} / ${total}`}
      aria-valuetext={`${label} ${step} / ${total}: ${title}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-baseline justify-center gap-0.5 rounded-xl bg-[#D0F2EE] pt-2 font-extrabold text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]"
          aria-hidden="true"
        >
          <span className="text-[15px] leading-none">{step}</span>
          <span className="text-[12px] leading-none text-[#152B54]/65 dark:text-[#00B59E]/65">/{total}</span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 break-words text-[12px] font-bold text-muted-foreground">{label}</span>
            <span className="shrink-0 text-[12px] font-bold text-muted-foreground">
              {Math.round((step / total) * 100)}%
            </span>
          </div>
          <h2 className="display-title mt-0.5 break-words text-[17px] leading-tight sm:text-[19px]">{title}</h2>
        </div>
      </div>
      {desc && <p className="mt-2.5 break-words text-[12.5px] leading-relaxed text-muted-foreground sm:mt-3">{desc}</p>}
      <div className="mt-3 flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const done = n <= step;
          return (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${done ? 'progress-live' : ''}`}
              aria-hidden="true"
              style={done
                ? { background: '#00B59E' }
                : { background: 'hsl(var(--muted))' }}
            />
          );
        })}
      </div>
    </section>
  );
}
