'use client';

import React, { use } from 'react';
import Link from 'next/link';

export default function OrderConfirmation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <main style={styles.main}>
      <div className="container" style={styles.container}>
        <div style={styles.icon}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 style={styles.title}>MERCI</h1>
        <p style={styles.subtitle}>
          Votre commande a été reçue. Nous préparons vos articles avec le plus grand soin.
        </p>
        <Link href="/shop" style={styles.btnPrimary}>
          Retourner à la boutique
        </Link>
        <div style={styles.orderInfo}>
          <span style={styles.orderLabel}>Order Ref: #{id}</span>
          <span style={styles.orderLabel}>Status: Confirmed</span>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: 'calc(100vh - 88px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '128px 0',
  },
  container: {
    maxWidth: '600px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    textAlign: 'center',
  },
  icon: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '96px',
    fontWeight: 800,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.04em',
    lineHeight: '100px',
    margin: 0,
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    color: 'var(--secondary)',
    lineHeight: '28px',
    maxWidth: '480px',
  },
  btnPrimary: {
    backgroundColor: 'var(--accent)',
    color: '#0A0A0A',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    border: '2px solid var(--accent)',
    padding: '16px 48px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: '15px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    marginTop: '40px',
  },
  orderInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '400px',
    marginTop: '96px',
    paddingTop: '48px',
    borderTop: '1px solid #2a2a2a',
  },
  orderLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};
