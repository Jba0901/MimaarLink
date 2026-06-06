'use client';

import React from 'react';

export default function WhatsAppIcon({ className, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <g transform="translate(1.6 1.6) scale(0.87)">
        <path d="M5.4 19.2 6.3 16A8 8 0 1 1 9 18.7l-3.6.5Z" />
        <path d="M9.2 8.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.3 0 .5-.1.7l-.4.5c.7 1.3 1.7 2.2 3 2.9l.6-.7c.2-.2.4-.2.7-.1l1.4.7c.3.1.4.3.4.6 0 .8-.7 1.7-1.7 1.7-1.5 0-3.5-.9-5.1-2.5S8.3 10.4 8.3 9.8c0-.3.3-.6.9-1Z" />
      </g>
    </svg>
  );
}
