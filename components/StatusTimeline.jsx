import React from 'react';
import { Check } from 'lucide-react';

export default function StatusTimeline({ statuses, currentIndex, getLabel }) {
  return (
    <ol className="space-y-1">
      {statuses.map((status, index) => {
        const complete = index < currentIndex;
        const current = index === currentIndex;
        const upcoming = !complete && !current;

        return (
          <li
            key={status}
            className="relative flex min-h-11 items-start gap-3"
            aria-current={current ? 'step' : undefined}
          >
            {index < statuses.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute bottom-[-20px] top-6 w-px ${complete ? 'bg-[#00B59E]' : 'bg-border'}`}
                style={{ insetInlineStart: 11.5 }}
              />
            )}

            <span
              aria-hidden="true"
              className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                complete
                  ? 'bg-[#00B59E] text-[#152B54]'
                  : current
                    ? 'border-2 border-[#00B59E] bg-[#D0F2EE] dark:bg-[#0D1B2A]'
                    : 'border border-border bg-card'
              }`}
            >
              {complete && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              {current && <span className="h-2 w-2 rounded-full bg-[#00B59E]" />}
            </span>

            <div
              className={`min-w-0 flex-1 rounded-xl px-3 py-2 text-sm leading-snug ${
                current
                  ? 'bg-[#D0F2EE]/60 font-bold text-navy dark:bg-[#00B59E]/15'
                  : complete
                    ? 'font-semibold text-navy'
                    : 'text-muted-foreground'
              }`}
            >
              <span className={`block break-words ${upcoming ? 'opacity-80' : ''}`}>{getLabel(status)}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
