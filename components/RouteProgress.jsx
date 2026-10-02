'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * A 2px teal line at the top of the page that starts the moment an internal
 * link is tapped and completes when the new route renders (BRAND.md section 7:
 * every tap responds instantly).
 */
export default function RouteProgress({ routeKey }) {
  const [state, setState] = useState('idle');
  const lastKey = useRef(routeKey);

  useEffect(() => {
    const onClick = (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      setState('loading');
      // From now on, pages that mount get a short settle-in (see .ml-routed in globals.css).
      document.documentElement.classList.add('ml-routed');
    };
    // Capture phase: Next.js links cancel the default before bubbling listeners run.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (routeKey === lastKey.current) return undefined;
    lastKey.current = routeKey;
    setState((current) => (current === 'loading' ? 'done' : current));
    const timer = window.setTimeout(() => setState('idle'), 400);
    return () => window.clearTimeout(timer);
  }, [routeKey]);

  return <div className="ml-route-progress" data-state={state} aria-hidden="true" />;
}
