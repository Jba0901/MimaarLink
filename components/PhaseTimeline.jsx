import React from 'react';
import { Check } from 'lucide-react';

/**
 * Brand status timeline (BRAND.md section 7): completed steps are teal with a
 * filled line, the current step is a ring, upcoming steps are grey. Vertical on
 * phones, horizontal from 640px. Logical properties keep it mirrored in Arabic.
 */
export default function PhaseTimeline({ phases, currentIndex, allDone = false, label }) {
  return (
    <ol className="ml-phases" aria-label={label}>
      {phases.map((phase, index) => {
        const state = allDone || index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo';
        return (
          <li key={phase} className="ml-phase" data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="ml-phase-dot" aria-hidden="true">{state === 'done' && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>
            <span className="ml-phase-label">{phase}</span>
          </li>
        );
      })}
    </ol>
  );
}
