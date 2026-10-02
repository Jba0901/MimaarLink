'use client';
import React, { useEffect, useRef } from 'react';

/**
 * Scroll reveals for any [data-reveal] element inside this group, on phones and
 * desktop alike. Content already on screen at load is never hidden, nothing is
 * hidden for reduced motion, and focus reveals immediately.
 */
export default function RevealGroup({ as: Tag = 'div', className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const targets = Array.from(root.querySelectorAll('[data-reveal], [data-reveal-stagger]'))
      .filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
    const show = (el) => el.classList.remove('is-pending');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => {
      el.classList.add('is-armed', 'is-pending');
      el.addEventListener('focusin', () => show(el), { once: true });
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return <Tag ref={ref} className={className}>{children}</Tag>;
}
