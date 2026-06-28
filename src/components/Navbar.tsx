'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('dk_cart') || '[]');
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCount();
    window.addEventListener('dk_cart_updated', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('dk_cart_updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        <Link href="/" style={styles.logo}>
          DIGITAL KIFF
        </Link>

        <nav style={styles.nav}>
          <Link
            href="/shop"
            style={{
              ...styles.navLink,
              ...(isActive('/shop') ? styles.navLinkActive : {}),
            }}
          >
            Boutique
          </Link>
          <Link
            href="/contact"
            style={{
              ...styles.navLink,
              ...(isActive('/contact') ? styles.navLinkActive : {}),
            }}
          >
            Contact
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new Event('dk_open_cart'));
            }}
            style={styles.cartBtn}
            aria-label="Panier"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderBottom: '1px solid #1A1A1A',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 900,
    textDecoration: 'none',
    color: 'var(--accent)',
    letterSpacing: '-0.03em',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    textDecoration: 'none',
    color: 'var(--on-surface)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
    paddingBottom: '2px',
    borderBottom: '2px solid transparent',
  },
  navLinkActive: {
    color: 'var(--primary)',
    borderBottom: '2px solid var(--primary)',
  },
  cartBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--on-surface)',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    transition: 'color 0.2s ease',
  },
  badge: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: 'var(--accent)',
    color: '#0A0A0A',
    fontSize: '10px',
    fontWeight: 700,
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
  },
};