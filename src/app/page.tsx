'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<PrintfulProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) {
          const items: PrintfulProduct[] = data.result || data || [];
          // Get first 4 products
          setFeaturedProducts(items.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <main style={styles.main}>
      {/* Hero */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroInner}>
          <h1 style={styles.heroTitle}>DIGITAL KIFF</h1>
          <p style={styles.heroSubtitle}>STUDIO DE DESIGN & OBJETS.</p>
          <Link href="/shop" style={styles.heroBtn}>
            Découvrir
          </Link>
        </div>
      </section>

      {/* Featured Pieces */}
      <section style={styles.featured}>
        <div className="container" style={styles.featuredInner}>
          <div style={styles.featuredHeader}>
            <h2 style={styles.featuredTitle}>
              DERNIÈRES<br />PIÈCES.
            </h2>
            <Link href="/shop" style={styles.viewAll}>VOIR TOUT</Link>
          </div>

          {loading ? (
            <div style={styles.loadingGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={styles.skeletonCard}>
                  <div style={styles.skeletonImage} />
                  <div style={styles.skeletonBody} />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div style={styles.featuredGrid}>
              {featuredProducts.map(item => (
                <article key={item.id} style={styles.featuredCard}>
                  <Link href={`/product/${item.id}`} style={{ display: 'contents' }}>
                    <div style={styles.featuredImgWrap}>
                      <img src={item.thumbnail_url || '/placeholder.png'} alt={item.name} style={styles.featuredImg} />
                    </div>
                  </Link>
                  <div style={styles.featuredCardBody}>
                    <span style={styles.featuredName}>{item.name}</span>
                    <Link href={`/product/${item.id}`} style={styles.featuredPlus}>
                      →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>Aucun produit disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Philosophy */}
      <section style={styles.philosophy}>
        <div className="container" style={styles.philosophyInner}>
          <div style={styles.philosophyLeft}>
            <h2 style={styles.philosophyTitle}>
              L'ESSENTIEL<br />
              ÉLEVÉ AU<br />
              RANG D'ART
            </h2>
          </div>
          <div style={styles.philosophyRight}>
            <p style={styles.philosophyText}>
              Digital Kiff explore la frontière entre le physique et le numérique à travers des pièces limitées et un design sans compromis.
            </p>
            <Link href="/shop" style={styles.philosophyBtn}>
              NOTRE APPROCHE
            </Link>
          </div>
        </div>
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
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '160px 0',
    borderBottom: '1px solid #1A1A1A',
  },
  heroInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '24px',
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '96px',
    fontWeight: 800,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.04em',
    lineHeight: '100px',
    margin: 0,
  },
  heroSubtitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    lineHeight: '32px',
    margin: 0,
  },
  heroBtn: {
    backgroundColor: 'var(--accent)',
    color: '#0A0A0A',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    border: '2px solid var(--accent)',
    padding: '16px 48px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    marginTop: '24px',
  },
  featured: {
    padding: '96px 0',
  },
  featuredInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '64px',
  },
  featuredHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  featuredTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '64px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    lineHeight: '72px',
    margin: 0,
  },
  viewAll: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textDecoration: 'none',
    borderBottom: '1px solid var(--on-surface)',
    paddingBottom: '4px',
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
  },
  featuredCard: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #353534',
    backgroundColor: '#131313',
  },
  featuredImgWrap: {
    aspectRatio: '1',
    backgroundColor: '#201f1f',
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(100%)',
    transition: 'filter 0.5s ease',
  },
  featuredCardBody: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #353534',
    gap: '12px',
  },
  featuredName: {
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--on-surface)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  featuredPlus: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textDecoration: 'none',
  },
  philosophy: {
    padding: '128px 0',
    borderTop: '1px solid #1A1A1A',
  },
  philosophyInner: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'center',
  },
  philosophyLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  philosophyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '64px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    lineHeight: '72px',
    margin: 0,
  },
  philosophyRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  philosophyText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    color: 'var(--on-surface)',
    lineHeight: '28px',
  },
  philosophyBtn: {
    border: '2px solid var(--on-surface)',
    backgroundColor: 'transparent',
    color: 'var(--on-surface)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    padding: '16px 32px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    width: 'fit-content',
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
  },
  skeletonCard: {
    border: '1px solid #1A1A1A',
    backgroundColor: '#131313',
    height: '350px',
    display: 'flex',
    flexDirection: 'column',
  },
  skeletonImage: {
    flexGrow: 1,
    backgroundColor: '#1E1E1E',
  },
  skeletonBody: {
    height: '60px',
    backgroundColor: '#181818',
  },
  emptyState: {
    padding: '48px',
    textAlign: 'center',
    color: 'var(--tertiary-container)',
    fontFamily: 'var(--font-sans)',
  },
};