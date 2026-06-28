'use client';

import React from 'react';
import Link from 'next/link';

const FEATURED_ITEMS = [
  {
    id: 101,
    name: 'Sculpture Numérique',
    price: '240€',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMatDyEX4-bKey4fjUuo35ZOvhVS0zTIlayposlXuZRtkrkArlBKfQ2xcUmKFdyboBm02bhOSJbwPYagZRMg_V5Tx4rmiZYugk_65yGbAi8B8JBjfJDm0XeO_r7ysUxll85KPkbcg4Ht_N5GCjgJsr0xCw5IYyvhJiTzLSkn3a5G1C5QEBTD_s4wBQnfPMJ2xzXNGGhtJDE2Cf-PfG8kYhkeT-B7kGWHFnSatmI0aOb1oijTX1ACu30gBmWUpe0VXUoFv0fwgHVOV',
    tag: 'Nouveau',
  },
  {
    id: 102,
    name: 'Vase Brutaliste',
    price: '180€',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMatDyEX4-bKey4fjUuo35ZOvhVS0zTIlayposlXuZRtkrkArlBKfQ2xcUmKFdyboBm02bhOSJbwPYagZRMg_V5Tx4rmiZYugk_65yGbAi8B8JBjfJDm0XeO_r7ysUxll85KPkbcg4Ht_N5GCjgJsr0xCw5IYyvhJiTzLSkn3a5G1C5QEBTD_s4wBQnfPMJ2xzXNGGhtJDE2Cf-PfG8kYhkeT-B7kGWHFnSatmI0aOb1oijTX1ACu30gBmWUpe0VXUoFv0fwgHVOV',
    tag: null,
  },
  {
    id: 103,
    name: 'Lampe Structurelle',
    price: '450€',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMatDyEX4-bKey4fjUuo35ZOvhVS0zTIlayposlXuZRtkrkArlBKfQ2xcUmKFdyboBm02bhOSJbwPYagZRMg_V5Tx4rmiZYugk_65yGbAi8B8JBjfJDm0XeO_r7ysUxll85KPkbcg4Ht_N5GCjgJsr0xCw5IYyvhJiTzLSkn3a5G1C5QEBTD_s4wBQnfPMJ2xzXNGGhtJDE2Cf-PfG8kYhkeT-B7kGWHFnSatmI0aOb1oijTX1ACu30gBmWUpe0VXUoFv0fwgHVOV',
    tag: 'Édition Limitée',
  },
  {
    id: 104,
    name: 'Assise Monolithique',
    price: '890€',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcMatDyEX4-bKey4fjUuo35ZOvhVS0zTIlayposlXuZRtkrkArlBKfQ2xcUmKFdyboBm02bhOSJbwPYagZRMg_V5Tx4rmiZYugk_65yGbAi8B8JBjfJDm0XeO_r7ysUxll85KPkbcg4Ht_N5GCjgJsr0xCw5IYyvhJiTzLSkn3a5G1C5QEBTD_s4wBQnfPMJ2xzXNGGhtJDE2Cf-PfG8kYhkeT-B7kGWHFnSatmI0aOb1oijTX1ACu30gBmWUpe0VXUoFv0fwgHVOV',
    tag: null,
  },
];

export default function Home() {
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
          <div style={styles.featuredGrid}>
            {FEATURED_ITEMS.map(item => (
              <article key={item.id} style={styles.featuredCard}>
                <Link href={`/shop`} style={{ display: 'contents' }}>
                  <div style={styles.featuredImgWrap}>
                    <img src={item.image} alt={item.name} style={styles.featuredImg} />
                    {item.tag && <span style={styles.featuredTag}>{item.tag}</span>}
                  </div>
                </Link>
                <div style={styles.featuredCardBody}>
                  <span style={styles.featuredName}>{item.name}</span>
                  <div style={styles.featuredPriceRow}>
                    <span style={styles.featuredPrice}>{item.price}</span>
                    <span style={styles.featuredPlus}>+</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
  featuredTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--accent)',
    color: '#0A0A0A',
    fontFamily: 'var(--font-sans)',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '4px 8px',
  },
  featuredCardBody: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #353534',
  },
  featuredName: {
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--on-surface)',
  },
  featuredPriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  featuredPrice: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--on-surface)',
  },
  featuredPlus: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    cursor: 'pointer',
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
};