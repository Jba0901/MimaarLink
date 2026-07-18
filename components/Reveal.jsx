'use client';
import React, { useEffect, useRef } from 'react';

const observedElements = new Set();
let sharedObserver = null;

function getSharedObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          sharedObserver?.unobserve(entry.target);
          observedElements.delete(entry.target);
        });

        if (observedElements.size === 0) {
          sharedObserver?.disconnect();
          sharedObserver = null;
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );
  }

  return sharedObserver;
}

function observeReveal(element) {
  const observer = getSharedObserver();
  observedElements.add(element);
  observer.observe(element);

  return () => {
    observer.unobserve(element);
    observedElements.delete(element);
    if (observedElements.size === 0 && sharedObserver === observer) {
      observer.disconnect();
      sharedObserver = null;
    }
  };
}

/**
 * Scroll-triggered fade-up reveal. Pure CSS transition driven by
 * IntersectionObserver — no dependencies, respects reduced-motion via CSS.
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    return observeReveal(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
