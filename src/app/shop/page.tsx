'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  synced: number;
}

export default function Shop() {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Erreur chargement produits');
        }
        // Printful v1 returns { result: [...] }
        const items: PrintfulProduct[] = data.result || data || [];
        setProducts(items);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <main style={styles.main}>
      {/* Sub-header */}
      <header style={styles.subHeader}>
        <div className="container" style={styles.subHeaderInner}>
          <div style={styles.titleRow}>
            <span style={styles.menuIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </span>
            <h1 style={styles.title}>BOUTIQUE</h1>
          </div>
          <p style={styles.subtitle}>
            {loading ? 'Chargement du catalogue...' : error ? '' : `${products.length} pièce${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </header>

      {/* Product Grid */}
      <section className="container" style={styles.gridSection}>
        {loading && (
          <div style={styles.stateBox}>
            <div style={styles.spinner} />
            <p style={styles.stateText}>Chargement des produits...</p>
          </div>
        )}

        {!loading && error && (
          <div style={styles.stateBox}>
            <p style={{ ...styles.stateText, color: 'var(--primary)' }}>
              Erreur : {error}
            </p>
            <button onClick={() => window.location.reload()} style={styles.retryBtn}>
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={styles.stateBox}>
            <p style={styles.stateText}>Aucun produit trouvé dans le catalogue.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={styles.grid}>
            {products.map(product => (
              <article key={product.id} style={styles.card}>
                <Link href={`/product/${product.id}`} style={{ display: 'contents' }}>
                  <div style={styles.imageWrapper}>
                    <img
                      src={product.thumbnail_url || '/placeholder.png'}
                      alt={product.name}
                      style={styles.image}
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div style={styles.cardBody}>
                  <h2 style={styles.productName}>{product.name}</h2>
                  <div style={styles.actions}>
                    <Link href={`/product/${product.id}`} style={styles.btnSecondary}>
                      Voir le produit
                    </Link>
                    <Link href={`/product/${product.id}`} style={styles.btnPrimary}>
                      Commander
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: 'calc(100vh - 88px)',
    display: 'flex',
    flexDirection: 'column',
  },
  subHeader: {
    backgroundColor: '#131313',
    borderBottom: '1px solid #1A1A1A',
  },
  subHeaderInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '48px',
    paddingBottom: '48px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  menuIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '64px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    lineHeight: '72px',
    margin: 0,
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--tertiary-container)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: 0,
  },
  gridSection: {
    paddingTop: '96px',
    paddingBottom: '96px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #353534',
    backgroundColor: '#131313',
    transition: 'border-color 0.3s ease',
  },
  imageWrapper: {
    aspectRatio: '3/4',
    backgroundColor: '#201f1f',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(100%)',
    transition: 'filter 0.5s ease',
  },
  cardBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexGrow: 1,
    justifyContent: 'space-between',
    borderTop: '1px solid #353534',
  },
  productName: {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    fontWeight: 400,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    lineHeight: '28px',
    margin: 0,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  btnSecondary: {
    width: '100%',
    border: '2px solid var(--on-surface)',
    color: 'var(--on-surface)',
    backgroundColor: 'transparent',
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '12px 24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  btnPrimary: {
    width: '100%',
    border: '2px solid var(--primary-container)',
    backgroundColor: 'var(--primary-container)',
    color: 'var(--on-primary-container)',
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '12px 24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  stateBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    minHeight: '300px',
  },
  stateText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--tertiary-container)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #1A1A1A',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  retryBtn: {
    border: '2px solid var(--primary)',
    color: 'var(--primary)',
    backgroundColor: 'transparent',
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '12px 32px',
    cursor: 'pointer',
  },
};