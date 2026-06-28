'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

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

  useEffect(() => {
    loadCart();
    
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    
    window.addEventListener('dk_open_cart', handleOpen);
    window.addEventListener('dk_close_cart', handleClose);
    window.addEventListener('dk_cart_updated', loadCart);
    
    return () => {
      window.removeEventListener('dk_open_cart', handleOpen);
      window.removeEventListener('dk_close_cart', handleClose);
      window.removeEventListener('dk_cart_updated', loadCart);
    };
  }, []);

  const updateQuantity = (variantId: number, change: number) => {
    const updated = cart.map(item => {
      if (item.variant_id === variantId) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
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

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div onClick={() => setIsOpen(false)} style={styles.backdrop}></div>}
      
      {/* Drawer */}
      <div style={{
        ...styles.drawer,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      }} className="glass">
        
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>PANIER</h2>
          <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>×</button>
        </div>

        {/* Content */}
        <div style={styles.body}>
          {cart.length === 0 ? (
            <div style={styles.empty}>
              <p>Votre panier est vide.</p>
            </div>
          ) : (
            <div style={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.variant_id} style={styles.itemCard}>
                  <div style={styles.imgWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.thumbnail} alt={item.product_name} style={styles.img} />
                  </div>
                  <div style={styles.itemInfo}>
                    <h4 style={styles.itemName}>{item.product_name}</h4>
                    <p style={styles.itemMeta}>Taille: {item.size}</p>
                    <div style={styles.qtyRow}>
                      <div style={styles.qtyControls}>
                        <button onClick={() => updateQuantity(item.variant_id, -1)} style={styles.qtyBtn}>-</button>
                        <span style={styles.qtyVal}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variant_id, 1)} style={styles.qtyBtn}>+</button>
                      </div>
                      <span onClick={() => removeItem(item.variant_id)} style={styles.removeBtn}>Retirer</span>
                    </div>
                  </div>
                  <span style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span>Sous-total</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${total.toFixed(2)} USD</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary" style={styles.checkoutBtn}>
              Valider la commande
            </button>
          </div>
        )}

      </div>
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
  },
  drawer: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    width: '100%',
    maxWidth: '420px',
    height: '100vh',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    borderLeft: '1px solid var(--border)',
    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid var(--border)',
  },
  title: {
    fontSize: '20px',
    fontFamily: 'var(--font-display)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '28px',
    cursor: 'pointer',
    lineHeight: 1,
  },
  body: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-secondary)',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  itemCard: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  imgWrapper: {
    width: '64px',
    height: '64px',
    backgroundColor: '#0F0F0F',
    borderRadius: '4px',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  itemName: {
    fontSize: '15px',
    fontWeight: 600,
  },
  itemMeta: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '4px',
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
  },
  qtyVal: {
    fontSize: '13px',
    width: '24px',
    textAlign: 'center' as const,
  },
  removeBtn: {
    fontSize: '12px',
    color: '#FF5555',
    cursor: 'pointer',
  },
  itemPrice: {
    fontWeight: 600,
    fontSize: '14px',
  },
  footer: {
    padding: '24px',
    borderTop: '1px solid var(--border)',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px',
  }
};
