'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const SIZES = ['S', 'M', 'L', 'XL'];

// Placeholder product data - will be replaced by Printful API
const PRODUCT = {
  id: 1,
  name: 'VESTE STRUCTURE 01',
  price: '120 €',
  description: 'Une architecture textile conçue pour l\'environnement urbain. Lignes pures, matériaux techniques, zéro compromis.',
  images: [
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCm4CJHAEbQD-V_dugXWIAnEKw4_5cicvL0_KufaiSppc18WM1L4UnTzQzLF9Q1F3ZfweLcGrg1H923kUdHY6bYY91wldlsVsWhW-JtNb0W0btjlj3cZh2Q4t5thj8PzVkefH6ktlb-ztG57B8dfzmosbiROvcvNad_lfBXRYLjbanX0lyDQisAjcW7xRwMNM4LXsO91yevq7pE2_7CbhB7fSI2Tz5reaL9BwIE8R95dw93-EV7UxiHYDfHH_AxI1Em2NkrkVG0-QM',
      alt: 'Main Product Image',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ5-eEGh2KObG23BEG8TnoD8RtGzWVEg8ABJWk4bCzP00jL216Y-VIXP24DtMQRDEk5PlOgdGrbxeoTZv5heV4EDgj5iOtBac3glyzgmkCrsUZk5-0tHdlnjgxtDpDE1sU08k2zTciU7EgsdzrPyJw2KoHrJmT02XngXS96OWYNqpbFUeugHtorYO6bvgFMUb9_VRZFLPgqCZq6OR9wpkF7KEC0OTCJbY0OQDxRNJHpyAppNqahy1Z3eEExZnXsdoY7skq0efCNLfp',
      alt: 'Thumbnail 1',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMH09B8Z6vkZGQpC2FaHeGN3Z4rNs_-hAWk_Z3usjm_V2HWtsUrjHF0kR2IBtri9Mq3Pi69DTVuJnzbmTfGntCqIBIHeJZ_2TL1mgH9B05RSrsGDlVv0rql2Z4e302eTBNhz5D5EWDPk24WJo5PeLhSmQNkqwkNsqq3_QM5QtEQaNEhdqb0ZfuivzUaEDjyqwtq9WaDahZg_S_FDCdMpklRMJ8-pVPEBUj5Vfx0tXBF1wwnIRTzA9L0W2v026q-7NnT91UYR43pyzo',
      alt: 'Thumbnail 2',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYBUvz8KCUXfkB0BLM7xXfX7_lgwu-MVMoWTtnhX6Qwxtu6Bp7_rowuZ7OvGWZ-bjitvZ1aEGFr1aoNg_l3GyfhFekPwRoxrzJZdXpGZmMH6ZidXv3Vc1-iSQyApKqmMeGEI5IPlvhst2A1QNuedHjENScgADjxOZWFX7padqqmw-24nSVMTGDwG1xTgspbuxXyC6I-XjZqvgVj6xObxmjw9XWGU654UdJs2Zl5k68iuMaFLEXhxR_MumSLEnMA8lPoWdFmWyO0zMu',
      alt: 'Thumbnail 3',
    },
  ],
};

export default function ProductDetail({ params }: ProductPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    setAdding(true);
    const cartItem = {
      product_id: PRODUCT.id,
      product_name: PRODUCT.name,
      variant_id: 1,
      sync_variant_id: 1,
      size: selectedSize,
      color: 'Noir',
      price: 120,
      quantity: quantity,
      thumbnail: PRODUCT.images[0].src,
    };
    const currentCart = JSON.parse(localStorage.getItem('dk_cart') || '[]');
    const existingIndex = currentCart.findIndex((item: any) => item.sync_variant_id === cartItem.sync_variant_id);
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += quantity;
    } else {
      currentCart.push(cartItem);
    }
    localStorage.setItem('dk_cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('dk_cart_updated'));
    setTimeout(() => {
      setAdding(false);
      window.dispatchEvent(new Event('dk_open_cart'));
    }, 600);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push('/checkout');
    }, 700);
  };

  return (
    <main style={styles.main}>
      <div className="container" style={styles.grid}>
        {/* Left: Gallery */}
        <div style={styles.gallery}>
          <div style={styles.mainImage}>
            <img
              src={PRODUCT.images[activeImage].src}
              alt={PRODUCT.images[activeImage].alt}
              style={styles.mainImg}
            />
            <div style={styles.imageBorder}></div>
          </div>
          <div style={styles.thumbnails}>
            {PRODUCT.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(idx)}
                style={{
                  ...styles.thumb,
                  ...(idx === activeImage ? styles.thumbActive : {}),
                }}
              >
                <img src={img.src} alt={img.alt} style={styles.thumbImg} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div style={styles.details}>
          <h1 style={styles.productTitle}>{PRODUCT.name}</h1>
          <p style={styles.price}>{PRODUCT.price}</p>
          <div style={styles.divider}></div>

          {/* Size Selector */}
          <div style={styles.optionSection}>
            <label style={styles.optionLabel}>Taille</label>
            <div style={styles.sizeGrid}>
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    ...styles.sizeBtn,
                    ...(selectedSize === size ? styles.sizeBtnActive : {}),
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={styles.optionSection}>
            <label style={styles.optionLabel}>Quantité</label>
            <div style={styles.qtyContainer}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.qtyBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span style={styles.qtyVal}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={styles.qtyBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              style={styles.btnSecondary}
            >
              {adding ? 'Ajout...' : 'Ajouter au Panier'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={adding}
              style={styles.btnPrimary}
            >
              Commander
            </button>
          </div>

          {/* Description */}
          <div style={styles.descriptionSection}>
            <p style={styles.description}>{PRODUCT.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: 'calc(100vh - 88px)',
    padding: '60px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '128px',
    alignItems: 'start',
  },
  gallery: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  mainImage: {
    aspectRatio: '4/5',
    backgroundColor: '#131313',
    position: 'relative',
    overflow: 'hidden',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(90%)',
  },
  imageBorder: {
    position: 'absolute',
    inset: 0,
    border: '1px solid #1A1A1A',
    pointerEvents: 'none',
  },
  thumbnails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  thumb: {
    aspectRatio: '1',
    backgroundColor: '#131313',
    border: '1px solid #1A1A1A',
    overflow: 'hidden',
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'opacity 0.3s ease',
  },
  thumbActive: {
    border: '1px solid var(--primary)',
    opacity: 1,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(100%)',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingTop: '64px',
  },
  productTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '40px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    lineHeight: '44px',
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    margin: 0,
  },
  price: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--accent)',
    lineHeight: '1.2',
    margin: 0,
  },
  divider: {
    height: '1px',
    backgroundColor: '#1A1A1A',
    margin: '12px 0',
  },
  optionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--on-surface)',
  },
  sizeGrid: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  sizeBtn: {
    width: '48px',
    height: '48px',
    border: '1px solid #1A1A1A',
    backgroundColor: 'transparent',
    color: 'var(--on-surface)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnActive: {
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    fontWeight: 700,
  },
  qtyContainer: {
    display: 'inline-flex',
    border: '1px solid #1A1A1A',
    height: '48px',
    alignItems: 'center',
  },
  qtyBtn: {
    width: '48px',
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
    width: '48px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--on-surface)',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px',
  },
  btnSecondary: {
    width: '100%',
    padding: '20px',
    border: '2px solid var(--on-surface)',
    backgroundColor: 'transparent',
    color: 'var(--on-surface)',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  btnPrimary: {
    width: '100%',
    padding: '20px',
    border: '2px solid var(--accent)',
    backgroundColor: 'var(--accent)',
    color: '#0A0A0A',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  descriptionSection: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '1px solid #1A1A1A',
  },
  description: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: '#666666',
    lineHeight: '1.6',
  },
};