'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  alt: string;
  category: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Veste Structure 01',
    price: '120 €',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6TWHxClh__sEvRsTHdbh1cMsqJaapstLQim1k1bIesJzqx0wltHCMjF-_1mZOTbwneVLlY74ML4IqrSLyhobPsRYaGNI8OROtzdxL6nYQKOd6oPobhvTvzmVE_IrUPFI12mhUXVodNfvta4yLeZS_ETFqtr9WSkOx3VV-HDn46rHL0JOWmI4VuGLSDFcQ8L1EnZF9YLW7wB43VzYCSHPUYk-q7BQi0nxloMpAfycMdf2UPiLvdfdyBhxTrZETzFkigzPrzStby05u',
    alt: 'Veste Structure 01',
    category: 'vestes',
  },
  {
    id: 2,
    name: 'T-shirt Logo Neon',
    price: '45 €',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXYijUGfzl1_wtFylZEcnF4_3jSGPRfKsM3HrSUf_Q7IUDnlMDSvBSvhSTSDunhAl7-jjB9L6ZGRH6Ymp9T-NhpE6ZulfAiuWL0JoMf1WcUvGS_8ytXm9vVPts-wfgsvQY9vad20kALmbhpXRqMaY0MZuwF43GGihgWiEDqAoHzqyQOImFqSMxjcZRTsFdOoniNOFuF5Qwbi6c_aMqb1tiqN4yT-sAFvymfM-rvUDMfDV-V1faayf2h6PVMgKpX0iz2gpFgxyDxUWb',
    alt: 'T-shirt Logo Neon',
    category: 't-shirts',
  },
  {
    id: 3,
    name: 'Set Accessoires Brut',
    price: '85 €',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC18R6qC254WDb68tUM0yyQq23PtTsUC2oHqJwc2yRn-bagWot0sZjx5UTaBFhacUu7xkCydpasVgPFsHJij8-EZJIzGluXPhbCF8orEAu34ee6Q2WjDUaPKlaiCUOU939UpiBLBTFwcoXMx-ADoHEjgYint0owgdI0hHeyxpxKto97KBBbhRpmhRV_zWPpsj94AaOCemvhsWfArf_Iy8yT4q58Az33briJ8sPDrgvu0d6iQg28J5h0zfbudzrmhC5ntrPeKnv92Ydn',
    alt: 'Set Accessoires Brut',
    category: 'accessoires',
  },
  {
    id: 4,
    name: 'Gilet Utilitaire Mono',
    price: '150 €',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0KblSfnN9PD-NO19hUWUPVOm3Z1ChZEgMZB4_ufpC7pbMrggEYaq2Tjw_heETS-fP2B3aG3YsTb7yww8JwmbX-Zx9g-WRh4A7Dyn11tqB7bfsoHEQEdYteouQuYUXgJbScwLFGoIn4dva2tuJrXzum05dHMOxKokNQPaKgaFkfmzY8HkzJOBPZG6o9brv5-MG7oT2mBVXqUjNlXOg9cVVOBzkemHw_9ack8IE7NEaELKLFtxEByEQrZjiSHkUntMMmG423qrUOnQ',
    alt: 'Gilet Utilitaire Mono',
    category: 'vestes',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Tout' },
  { id: 'vestes', name: 'Vestes' },
  { id: 't-shirts', name: 'T-shirts' },
  { id: 'accessoires', name: 'Accessoires' },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add placeholder - would redirect to product page for variant selection
    window.location.href = `/product/${product.id}`;
  };

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
          <nav style={styles.filterNav}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  ...styles.filterBtn,
                  ...(activeCategory === cat.id ? styles.filterBtnActive : {}),
                }}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Product Grid */}
      <section className="container" style={styles.gridSection}>
        <div style={styles.grid}>
          {filtered.map(product => (
            <article key={product.id} style={styles.card}>
              <Link href={`/product/${product.id}`} style={{ display: 'contents' }}>
                <div style={styles.imageWrapper}>
                  <img
                    src={product.image}
                    alt={product.alt}
                    style={styles.image}
                    loading="lazy"
                  />
                </div>
              </Link>
              <div style={styles.cardBody}>
                <h2 style={styles.productName}>{product.name}</h2>
                <p style={styles.price}>{product.price}</p>
                <div style={styles.actions}>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    style={styles.btnSecondary}
                  >
                    + Panier
                  </button>
                  <Link href={`/product/${product.id}`} style={styles.btnPrimary}>
                    Commander
                  </Link>
                </div>
              </div>
            </article>
          ))}
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
  subHeader: {
    backgroundColor: '#131313',
    borderBottom: '1px solid #1A1A1A',
  },
  subHeaderInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
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
  filterNav: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--tertiary-container)',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    paddingBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  filterBtnActive: {
    color: 'var(--on-surface)',
    borderBottom: '2px solid var(--primary)',
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
  },
  price: {
    fontFamily: 'var(--font-display)',
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--primary-container)',
    lineHeight: '40px',
    letterSpacing: '-0.01em',
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
};