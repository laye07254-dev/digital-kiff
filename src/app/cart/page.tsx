'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadCart = () => {
      try {
        const items = JSON.parse(localStorage.getItem('dk_cart') || '[]');
        setCart(items);
        const t = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        setTotal(t);
      } catch (e) {
        setCart([]);
      }
    };

    loadCart();
    window.addEventListener('dk_cart_updated', loadCart);
    return () => window.removeEventListener('dk_cart_updated', loadCart);
  }, []);

  const updateQuantity = (variantId: number, change: number) => {
    const updated = cart.map(item => {
      if (item.variant_id === variantId) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    localStorage.setItem('dk_cart', JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event('dk_cart_updated'));
  };

  const removeItem = (variantId: number) => {
    const updated = cart.filter(item => item.variant_id !== variantId);
    localStorage.setItem('dk_cart', JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event('dk_cart_updated'));
  };

  return (
    <main style={styles.main}>
      <div className="container" style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Panier</h1>
          <span style={styles.itemCount}>
            {cart.length} {cart.length === 1 ? 'Article' : 'Articles'}
          </span>
        </div>

        {cart.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>Votre panier est vide.</p>
            <Link href="/shop" style={styles.btnPrimary}>
              Continuer vos achats
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {/* Cart Items */}
            <div style={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.variant_id} style={styles.itemRow}>
                  <div style={styles.imgCol}>
                    <img src={item.thumbnail} alt={item.product_name} style={styles.img} />
                  </div>
                  <div style={styles.detailsCol}>
                    <div style={styles.itemHeader}>
                      <h3 style={styles.itemName}>{item.product_name}</h3>
                      <button
                        onClick={() => removeItem(item.variant_id)}
                        style={styles.removeBtn}
                        aria-label="Retirer"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <p style={styles.itemMeta}>Taille: {item.size}</p>
                    <div style={styles.stockBadge}>
                      <span style={styles.stockText}>En Stock</span>
                    </div>
                    <div style={styles.itemFooter}>
                      <div style={styles.qtyContainer}>
                        <button
                          onClick={() => updateQuantity(item.variant_id, -1)}
                          style={styles.qtyBtn}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span style={styles.qtyVal}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variant_id, 1)}
                          style={styles.qtyBtn}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                      <span style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Résumé</h2>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Sous-total</span>
                <span style={styles.summaryValue}>{total.toFixed(2)} €</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Livraison</span>
                <span style={styles.summaryValueMuted}>Calculé à l'étape suivante</span>
              </div>
              <div style={styles.summaryDivider}></div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>{total.toFixed(2)} €</span>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                style={styles.checkoutBtn}
              >
                Commander
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: 'calc(100vh - 88px)',
    padding: '128px 0',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    borderBottom: '1px solid #1A1A1A',
    paddingBottom: '16px',
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
  itemCount: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--on-surface-variant)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '80px 0',
  },
  emptyText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    color: 'var(--on-surface-variant)',
  },
  btnPrimary: {
    backgroundColor: 'var(--accent)',
    color: '#0A0A0A',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    border: '2px solid var(--accent)',
    padding: '16px 36px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '40px',
    alignItems: 'start',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  itemRow: {
    display: 'flex',
    padding: '32px 0',
    borderBottom: '1px solid #1A1A1A',
    gap: '32px',
    alignItems: 'flex-start',
  },
  imgCol: {
    width: '240px',
    aspectRatio: '3/4',
    backgroundColor: '#111111',
    overflow: 'hidden',
    flexShrink: 0,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(80%)',
  },
  detailsCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    lineHeight: '1.2',
    margin: 0,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--on-surface-variant)',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s ease',
  },
  itemMeta: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    color: 'var(--on-surface-variant)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  stockBadge: {
    display: 'inline-block',
    backgroundColor: '#111111',
    border: '1px solid #1A1A1A',
    padding: '4px 12px',
    width: 'fit-content',
  },
  stockText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  qtyContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #1A1A1A',
    height: '48px',
    width: '128px',
  },
  qtyBtn: {
    flex: 1,
    height: '100%',
    background: 'none',
    border: 'none',
    color: 'var(--on-surface)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
  qtyVal: {
    flex: 1,
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--on-surface)',
  },
  itemPrice: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--accent)',
  },
  summaryCard: {
    backgroundColor: '#111111',
    border: '1px solid #1A1A1A',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'sticky',
    top: '120px',
  },
  summaryTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    borderBottom: '1px solid #1A1A1A',
    paddingBottom: '16px',
    margin: 0,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  summaryValue: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--on-surface)',
  },
  summaryValueMuted: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--on-surface-variant)',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#1A1A1A',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
  },
  totalValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--accent)',
  },
  checkoutBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--accent)',
    color: '#0A0A0A',
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '2px solid var(--accent)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};