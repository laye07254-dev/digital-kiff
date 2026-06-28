'use client';

import React, { useEffect, useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  onSuccess: (details: any) => void;
  onError: (err: any) => void;
}

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if paypal script is already loaded
    if ((window as any).paypal) {
      setLoaded(true);
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb'; // fallback to sandbox 'sb'
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.addEventListener('load', () => setLoaded(true));
    script.addEventListener('error', () => setError('Failed to load PayPal SDK'));
    document.body.appendChild(script);

    return () => {
      // Keep script loaded to avoid multiple loads
    };
  }, []);

  useEffect(() => {
    if (!loaded || !(window as any).paypal) return;

    // Clear previous button content if any
    const container = document.getElementById('paypal-btn-container');
    if (container) container.innerHTML = '';

    (window as any).paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2),
              currency_code: 'USD'
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const details = await actions.order.capture();
        onSuccess(details);
      },
      onError: (err: any) => {
        console.error('PayPal Error:', err);
        onError(err);
      },
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      }
    }).render('#paypal-btn-container');
  }, [loaded, amount, onSuccess, onError]);

  return (
    <div style={{ width: '100%' }}>
      {error && <p style={{ color: '#FF3333', fontSize: '14px' }}>{error}</p>}
      {!loaded && !error && <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Chargement de PayPal...</p>}
      <div id="paypal-btn-container" style={{ minHeight: '150px' }}></div>
    </div>
  );
}
