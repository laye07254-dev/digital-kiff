'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

interface PrintfulFile {
  type: string;
  preview_url?: string;
  url?: string;
  thumbnail_url?: string;
}

interface PrintfulVariant {
  id: number;
  variant_id: number;
  name: string;
  retail_price: string;
  size: string;
  color?: string;
  files: PrintfulFile[];
  product?: {
    image?: string;
  };
}

interface PrintfulProductDetail {
  sync_product: {
    id: number;
    name: string;
    thumbnail_url: string;
  };
  sync_variants: PrintfulVariant[];
}

export default function ProductDetail({ params }: ProductPageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [productDetail, setProductDetail] = useState<PrintfulProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors du chargement du produit');
        }

        const detail: PrintfulProductDetail = data.result || data;
        setProductDetail(detail);

        // Pre-select first size
        if (detail.sync_variants && detail.sync_variants.length > 0) {
          setSelectedSize(detail.sync_variants[0].size);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.stateBox}>
          <div style={styles.spinner} />
          <p style={styles.stateText}>Chargement des détails du produit...</p>
        </div>
      </main>
    );
  }

  if (error || !productDetail) {
    return (
      <main style={styles.main}>
        <div style={styles.stateBox}>
          <p style={{ ...styles.stateText, color: 'var(--primary)' }}>
            Erreur : {error || 'Produit introuvable'}
          </p>
          <button onClick={() => window.location.reload()} style={styles.retryBtn}>
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  const { sync_product, sync_variants } = productDetail;

  // Extract all unique sizes available
  const sizes = Array.from(new Set(sync_variants.map(v => v.size)));

  // Find currently selected variant based on size
  const currentVariant = sync_variants.find(v => v.size === selectedSize) || sync_variants[0];

  // Extract all images (mockups / previews)
  const images: string[] = [];
  
  // Add main thumbnail first
  if (sync_product.thumbnail_url) {
    images.push(sync_product.thumbnail_url);
  }

  // Add previews from variants if any
  sync_variants.forEach(variant => {
    const previewFile = variant.files.find(f => f.type === 'preview');
    if (previewFile?.preview_url && !images.includes(previewFile.preview_url)) {
      images.push(previewFile.preview_url);
    } else if (variant.product?.image && !images.includes(variant.product.image)) {
      images.push(variant.product.image);
    }
  });

  // Unique list of image strings
  const uniqueImages = Array.from(new Set(images.filter(Boolean)));

  const handleAddToCart = () => {
    if (!currentVariant) return;
    
    setAdding(true);
    const cartItem = {
      product_id: sync_product.id,
      product_name: sync_product.name,
      variant_id: currentVariant.variant_id, // Base catalog variant ID
      sync_variant_id: currentVariant.id,    // Store synced variant ID
      size: currentVariant.size,
      color: currentVariant.color || 'Unique',
      price: parseFloat(currentVariant.retail_price) || 0,
      quantity: quantity,
      thumbnail: currentVariant.files.find(f => f.type === 'preview')?.preview_url || uniqueImages[0] || sync_product.thumbnail_url,
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

  // Safe image display
  const mainImageSrc = uniqueImages[activeImage] || sync_product.thumbnail_url || '/placeholder.png';

  return (
    <main style={styles.main}>
      <div className="container" style={styles.grid}>
        {/* Left: Gallery */}
        <div style={styles.gallery}>
          <div style={styles.mainImage}>
            <img
              src={mainImageSrc}
              alt={sync_product.name}
              style={styles.mainImg}
            />
            <div style={styles.imageBorder}></div>
          </div>
          {uniqueImages.length > 1 && (
            <div style={styles.thumbnails}>
              {uniqueImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  style={{
                    ...styles.thumb,
                    ...(idx === activeImage ? styles.thumbActive : {}),
                  }}
                >
                  <img src={imgSrc} alt={`${sync_product.name} thumbnail ${idx}`} style={styles.thumbImg} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div style={styles.details}>
          <h1 style={styles.productTitle}>{sync_product.name}</h1>
          <p style={styles.price}>
            {currentVariant ? `${parseFloat(currentVariant.retail_price).toFixed(2)} €` : 'N/A'}
          </p>
          <div style={styles.divider}></div>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div style={styles.optionSection}>
              <label style={styles.optionLabel}>Taille</label>
              <div style={styles.sizeGrid}>
                {sizes.map(size => (
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
          )}

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

          {/* Description / Info */}
          <div style={styles.descriptionSection}>
            <p style={styles.description}>
              Une création exclusive de DIGITAL KIFF. Design soigné et impression haute définition à la demande.
            </p>
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
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
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
    alignSelf: 'flex-start',
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
    margin: 0,
  },
  stateBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    minHeight: '400px',
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