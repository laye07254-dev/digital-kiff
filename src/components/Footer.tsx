'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.footerInner}>
        <div style={styles.brand}>
          DIGITAL KIFF
        </div>
        <nav style={styles.links}>
          <Link href="/privacy" style={styles.link}>Privacy Policy</Link>
          <Link href="/terms" style={styles.link}>Terms of Service</Link>
          <Link href="/shipping" style={styles.link}>Shipping</Link>
          <Link href="https://instagram.com" style={styles.link}>Instagram</Link>
        </nav>
        <div style={styles.copyright}>
          © 2024 DIGITAL KIFF. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#0A0A0A',
    borderTop: '1px solid #1A1A1A',
    marginTop: 'auto',
  },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px 64px',
    flexWrap: 'wrap',
    gap: '24px',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
  },
  links: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
  },
  link: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--tertiary-container)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'color 0.2s ease',
  },
  copyright: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--tertiary-container)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};