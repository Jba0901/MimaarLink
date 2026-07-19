'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Animated number that counts up when scrolled into view.
 * Parses a value like "$70B", "10%", "6" into prefix / number / suffix and
 * animates only the number, preserving formatting.
 *
 * Safety first: default display is the REAL value, and a fallback guarantees
 * the real value shows even if IntersectionObserver / rAF misbehave — a stat
 * can never get stuck at 0. The count-up is a pure enhancement. RTL-safe.
 */
export default function CountUp({ value, duration = 1400, className = '', staticBelow = 0 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const match = String(value).match(/^(\D*)([\d.,]+)(.*)$/);
    if (!el || !match) { setDisplay(value); return; }

    const prefix = match[1] || '';
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const target = parseFloat(numStr);
    const decimals = numStr.includes('.') ? (numStr.split('.')[1] || '').length : 0;
    const format = (n) =>
      prefix + (decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString('en-US')) + suffix;

    const reduced = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const staticViewport = staticBelow > 0
      && window.matchMedia
      && window.matchMedia(`(max-width: ${staticBelow - 1}px)`).matches;

    if (reduced || staticViewport || typeof IntersectionObserver === 'undefined') {
      setDisplay(format(target));
      return;
    }

    let raf, started = false, finished = false;
    const animate = () => {
      if (started) return;
      started = true;
      setDisplay(format(0));
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        setDisplay(format(target * (1 - Math.pow(1 - p, 3)))); // easeOutCubic
        if (p < 1) raf = requestAnimationFrame(step);
        else finished = true;
      };
      raf = requestAnimationFrame(step);
    };

    const rect = el.getBoundingClientRect();
    const inViewNow = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

    let io;
    if (inViewNow) {
      animate();
    } else {
      setDisplay(format(0));
      io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { animate(); io.disconnect(); } },
        { threshold: 0.3 }
      );
      io.observe(el);
    }

    const safety = setTimeout(() => { if (!started && !finished) setDisplay(format(target)); }, 2500);

    return () => {
      if (io) io.disconnect();
      clearTimeout(safety);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, staticBelow]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className={className}>
      <bdi dir="ltr">{display}</bdi>
    </span>
  );
}
