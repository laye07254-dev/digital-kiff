'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PayPalButton from '@/components/PayPalButton';

interface Address {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  country_code: string;
  zip: string;
}

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [address, setAddress] = useState<Address>({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    country_code: 'FR',
    zip: '',
  });

  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('dk_cart') || '[]');
      if (items.length === 0) {
        router.push('/cart');
        return;
      }
      setCart(items);
      const sub = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
      setSubtotal(sub);
      setTotal(sub);
    } catch (e) {
      router.push('/cart');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const calculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.address1 || !address.city || !address.zip || !address.firstName || !address.lastName || !address.email) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setCalculating(true);
    setError('');
    setShippingRates([]);
    setSelectedRate(null);
    setShippingCost(0);
    setTotal(subtotal);

    try {
      const items = cart.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity
      }));

      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: {
            address1: address.address1,
            city: address.city,
            country_code: address.country_code,
            zip: address.zip
          },
          items
        })
      });

      if (!res.ok) throw new Error('Erreur lors du calcul des tarifs');
      const data = await res.json();

      if (data.result && data.result.length > 0) {
        setShippingRates(data.result);
        setSelectedRate(data.result[0]);
        const cost = parseFloat(data.result[0].rate);
        setShippingCost(cost);
        setTotal(subtotal + cost);
      } else {
        setError('Aucun mode de livraison trouvé.');
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de calculer la livraison');
    } finally {
      setCalculating(false);
    }
  };

  const handleRateChange = (rateObj: any) => {
    setSelectedRate(rateObj);
    const cost = parseFloat(rateObj.rate);
    setShippingCost(cost);
    setTotal(subtotal + cost);
  };

  const handlePaymentSuccess = async (details: any) => {
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: {
            name: `${address.firstName} ${address.lastName}`,
            address1: address.address1,
            city: address.city,
            country_code: address.country_code,
            zip: address.zip,
          },
          items: cart.map(item => ({
            variant_id: item.variant_id,
            quantity: item.quantity
          })),
          shipping: selectedRate?.id,
          payment_id: details.id
        })
      });

      if (!res.ok) throw new Error('Erreur de création Printful');
      const data = await res.json();

      localStorage.removeItem('dk_cart');
      window.dispatchEvent(new Event('dk_cart_updated'));
      router.push(`/order/${data.result?.id || details.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur de commande');
    }
  };

  return (
    <>
      {/* Minimal Header */}
      <header style={styles.miniHeader}>
        <div className="container" style={styles.miniHeaderInner}>
          <span style={styles.brand}>Digital Kiff</span>
          <Link href="/cart" style={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Retour au panier
          </Link>
        </div>
      </header>

      <main style={styles.main}>
        <div className="container" style={styles.container}>
          <h1 style={styles.title}>COMMANDE</h1>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.grid}>
            {/* Left Column */}
            <div style={styles.leftCol}>
              {/* Contact */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Contact</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse e-mail"
                  value={address.email}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </section>

              {/* Shipping Address */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Adresse de livraison</h2>
                <div style={styles.formGrid}>
                  <div style={styles.formFull}>
                    <select name="country_code" value={address.country_code} onChange={handleInputChange} style={styles.select}>
                      <option value="FR">France</option>
                      <option value="AF">Afghanistan</option>
                      <option value="ZA">Afrique du Sud</option>
                      <option value="AL">Albanie</option>
                      <option value="DZ">Algérie</option>
                      <option value="DE">Allemagne</option>
                      <option value="AD">Andorre</option>
                      <option value="AO">Angola</option>
                      <option value="AG">Antigua-et-Barbuda</option>
                      <option value="SA">Arabie saoudite</option>
                      <option value="AR">Argentine</option>
                      <option value="AM">Arménie</option>
                      <option value="AU">Australie</option>
                      <option value="AT">Autriche</option>
                      <option value="AZ">Azerbaïdjan</option>
                      <option value="BS">Bahamas</option>
                      <option value="BH">Bahreïn</option>
                      <option value="BD">Bangladesh</option>
                      <option value="BB">Barbade</option>
                      <option value="BE">Belgique</option>
                      <option value="BZ">Belize</option>
                      <option value="BJ">Bénin</option>
                      <option value="BT">Bhoutan</option>
                      <option value="BY">Biélorussie</option>
                      <option value="MM">Birmanie</option>
                      <option value="BO">Bolivie</option>
                      <option value="BA">Bosnie-Herzégovine</option>
                      <option value="BW">Botswana</option>
                      <option value="BR">Brésil</option>
                      <option value="BN">Brunéi</option>
                      <option value="BG">Bulgarie</option>
                      <option value="BF">Burkina Faso</option>
                      <option value="BI">Burundi</option>
                      <option value="KH">Cambodge</option>
                      <option value="CM">Cameroun</option>
                      <option value="CA">Canada</option>
                      <option value="CV">Cap-Vert</option>
                      <option value="CF">Centrafrique</option>
                      <option value="CL">Chili</option>
                      <option value="CN">Chine</option>
                      <option value="CY">Chypre</option>
                      <option value="CO">Colombie</option>
                      <option value="KM">Comores</option>
                      <option value="CG">Congo</option>
                      <option value="CD">Congo (RDC)</option>
                      <option value="KR">Corée du Sud</option>
                      <option value="CR">Costa Rica</option>
                      <option value="CI">Côte d'Ivoire</option>
                      <option value="HR">Croatie</option>
                      <option value="CU">Cuba</option>
                      <option value="DK">Danemark</option>
                      <option value="DJ">Djibouti</option>
                      <option value="DM">Dominique</option>
                      <option value="EG">Égypte</option>
                      <option value="AE">Émirats arabes unis</option>
                      <option value="EC">Équateur</option>
                      <option value="ER">Érythrée</option>
                      <option value="ES">Espagne</option>
                      <option value="EE">Estonie</option>
                      <option value="SZ">Eswatini</option>
                      <option value="ET">Éthiopie</option>
                      <option value="FJ">Fidji</option>
                      <option value="FI">Finlande</option>
                      <option value="GA">Gabon</option>
                      <option value="GM">Gambie</option>
                      <option value="GE">Géorgie</option>
                      <option value="GH">Ghana</option>
                      <option value="GR">Grèce</option>
                      <option value="GD">Grenade</option>
                      <option value="GT">Guatemala</option>
                      <option value="GN">Guinée</option>
                      <option value="GQ">Guinée équatoriale</option>
                      <option value="GW">Guinée-Bissau</option>
                      <option value="GY">Guyana</option>
                      <option value="HT">Haïti</option>
                      <option value="HN">Honduras</option>
                      <option value="HU">Hongrie</option>
                      <option value="IN">Inde</option>
                      <option value="ID">Indonésie</option>
                      <option value="IQ">Irak</option>
                      <option value="IR">Iran</option>
                      <option value="IE">Irlande</option>
                      <option value="IS">Islande</option>
                      <option value="IL">Israël</option>
                      <option value="IT">Italie</option>
                      <option value="JM">Jamaïque</option>
                      <option value="JP">Japon</option>
                      <option value="JO">Jordanie</option>
                      <option value="KZ">Kazakhstan</option>
                      <option value="KE">Kenya</option>
                      <option value="KG">Kirghizistan</option>
                      <option value="KI">Kiribati</option>
                      <option value="XK">Kosovo</option>
                      <option value="KW">Koweït</option>
                      <option value="LA">Laos</option>
                      <option value="LS">Lesotho</option>
                      <option value="LV">Lettonie</option>
                      <option value="LB">Liban</option>
                      <option value="LR">Liberia</option>
                      <option value="LY">Libye</option>
                      <option value="LI">Liechtenstein</option>
                      <option value="LT">Lituanie</option>
                      <option value="LU">Luxembourg</option>
                      <option value="MK">Macédoine du Nord</option>
                      <option value="MG">Madagascar</option>
                      <option value="MY">Malaisie</option>
                      <option value="MW">Malawi</option>
                      <option value="MV">Maldives</option>
                      <option value="ML">Mali</option>
                      <option value="MT">Malte</option>
                      <option value="MA">Maroc</option>
                      <option value="MH">Marshall</option>
                      <option value="MR">Mauritanie</option>
                      <option value="MU">Maurice</option>
                      <option value="MX">Mexique</option>
                      <option value="FM">Micronésie</option>
                      <option value="MD">Moldavie</option>
                      <option value="MC">Monaco</option>
                      <option value="MN">Mongolie</option>
                      <option value="ME">Monténégro</option>
                      <option value="MZ">Mozambique</option>
                      <option value="NA">Namibie</option>
                      <option value="NR">Nauru</option>
                      <option value="NP">Népal</option>
                      <option value="NI">Nicaragua</option>
                      <option value="NE">Niger</option>
                      <option value="NG">Nigeria</option>
                      <option value="NO">Norvège</option>
                      <option value="NZ">Nouvelle-Zélande</option>
                      <option value="OM">Oman</option>
                      <option value="UG">Ouganda</option>
                      <option value="UZ">Ouzbékistan</option>
                      <option value="PK">Pakistan</option>
                      <option value="PW">Palaos</option>
                      <option value="PA">Panama</option>
                      <option value="PG">Papouasie-Nouvelle-Guinée</option>
                      <option value="PY">Paraguay</option>
                      <option value="NL">Pays-Bas</option>
                      <option value="PE">Pérou</option>
                      <option value="PH">Philippines</option>
                      <option value="PL">Pologne</option>
                      <option value="PT">Portugal</option>
                      <option value="QA">Qatar</option>
                      <option value="RO">Roumanie</option>
                      <option value="GB">Royaume-Uni</option>
                      <option value="RU">Russie</option>
                      <option value="RW">Rwanda</option>
                      <option value="KN">Saint-Christophe-et-Niévès</option>
                      <option value="SM">Saint-Marin</option>
                      <option value="VC">Saint-Vincent-et-les-Grenadines</option>
                      <option value="SB">Salomon</option>
                      <option value="SV">Salvador</option>
                      <option value="WS">Samoa</option>
                      <option value="ST">Sao Tomé-et-Principe</option>
                      <option value="SN">Sénégal</option>
                      <option value="RS">Serbie</option>
                      <option value="SC">Seychelles</option>
                      <option value="SL">Sierra Leone</option>
                      <option value="SG">Singapour</option>
                      <option value="SK">Slovaquie</option>
                      <option value="SI">Slovénie</option>
                      <option value="SO">Somalie</option>
                      <option value="SD">Soudan</option>
                      <option value="SS">Soudan du Sud</option>
                      <option value="LK">Sri Lanka</option>
                      <option value="SE">Suède</option>
                      <option value="CH">Suisse</option>
                      <option value="SR">Suriname</option>
                      <option value="SY">Syrie</option>
                      <option value="TJ">Tadjikistan</option>
                      <option value="TZ">Tanzanie</option>
                      <option value="TD">Tchad</option>
                      <option value="CZ">Tchéquie</option>
                      <option value="TH">Thaïlande</option>
                      <option value="TL">Timor-Leste</option>
                      <option value="TG">Togo</option>
                      <option value="TO">Tonga</option>
                      <option value="TT">Trinité-et-Tobago</option>
                      <option value="TN">Tunisie</option>
                      <option value="TM">Turkménistan</option>
                      <option value="TR">Turquie</option>
                      <option value="TV">Tuvalu</option>
                      <option value="UA">Ukraine</option>
                      <option value="UY">Uruguay</option>
                      <option value="US">États-Unis</option>
                      <option value="VU">Vanuatu</option>
                      <option value="VA">Vatican</option>
                      <option value="VE">Venezuela</option>
                      <option value="VN">Vietnam</option>
                      <option value="YE">Yémen</option>
                      <option value="ZM">Zambie</option>
                      <option value="ZW">Zimbabwe</option>
                    </select>
                  </div>
                  <div style={styles.formHalf}>
                    <input type="text" name="firstName" placeholder="Prénom" value={address.firstName} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.formHalf}>
                    <input type="text" name="lastName" placeholder="Nom" value={address.lastName} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.formFull}>
                    <input type="text" name="address1" placeholder="Adresse" value={address.address1} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.formFull}>
                    <input type="text" name="address2" placeholder="Appartement, suite, etc. (optionnel)" value={address.address2} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.formHalf}>
                    <input type="text" name="zip" placeholder="Code postal" value={address.zip} onChange={handleInputChange} style={styles.input} />
                  </div>
                  <div style={styles.formHalf}>
                    <input type="text" name="city" placeholder="Ville" value={address.city} onChange={handleInputChange} style={styles.input} />
                  </div>
                </div>

                <button
                  onClick={calculateShipping}
                  disabled={calculating}
                  style={styles.calcBtn}
                >
                  {calculating ? 'Calcul de livraison...' : 'Calculer les frais de port'}
                </button>
              </section>

              {/* Shipping Rates */}
              {shippingRates.length > 0 && (
                <section style={styles.section}>
                  <h2 style={styles.sectionTitle}>Options de livraison</h2>
                  <div style={styles.ratesList}>
                    {shippingRates.map((rate) => (
                      <label
                        key={rate.id}
                        onClick={() => handleRateChange(rate)}
                        style={{
                          ...styles.rateLabel,
                          ...(selectedRate?.id === rate.id ? styles.rateLabelActive : {}),
                        }}
                      >
                        <input
                          type="radio"
                          name="shipping_rate"
                          checked={selectedRate?.id === rate.id}
                          onChange={() => handleRateChange(rate)}
                          style={styles.radio}
                        />
                        <div style={styles.rateInfo}>
                          <span style={styles.rateName}>{rate.name}</span>
                          <span style={styles.rateDays}>{rate.min_delivery_days}-{rate.max_delivery_days} jours</span>
                        </div>
                        <span style={styles.rateCost}>{rate.rate} €</span>
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {/* Payment */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Paiement</h2>
                <div style={styles.paymentOptions}>
                  <button style={styles.paypalBtn}>
                    <span style={styles.paypalText}>
                      <i>Pay</i><b>Pal</b>
                    </span>
                  </button>
                  <button style={styles.cardBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Carte Bancaire
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column: Summary */}
            <div style={styles.rightCol}>
              <div style={styles.summaryCard}>
                <h2 style={styles.summaryTitle}>Résumé</h2>

                <div style={styles.itemsList}>
                  {cart.map(item => (
                    <div key={item.variant_id} style={styles.summaryItem}>
                      <div style={styles.itemThumb}>
                        <img src={item.thumbnail} alt={item.product_name} style={styles.thumbImg} />
                        <span style={styles.itemQty}>{item.quantity}</span>
                      </div>
                      <div style={styles.itemInfo}>
                        <span style={styles.itemName}>{item.product_name}</span>
                        <span style={styles.itemMeta}>Taille: {item.size}</span>
                      </div>
                      <span style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                <div style={styles.summaryDivider}></div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Sous-total</span>
                  <span style={styles.summaryValue}>{subtotal.toFixed(2)} €</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Expédition</span>
                  <span style={styles.summaryValueMuted}>
                    {shippingCost > 0 ? `${shippingCost.toFixed(2)} €` : 'Calculé à l\'étape suivante'}
                  </span>
                </div>

                <div style={styles.summaryDivider}></div>

                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total</span>
                  <div style={styles.totalValueWrap}>
                    <span style={styles.totalCurrency}>EUR</span>
                    <span style={styles.totalValue}>{total.toFixed(2)} €</span>
                  </div>
                </div>

                {selectedRate ? (
                  <div style={{ marginTop: '24px' }}>
                    <PayPalButton
                      amount={total}
                      onSuccess={handlePaymentSuccess}
                      onError={(err) => setError('Une erreur est survenue avec PayPal.')}
                    />
                  </div>
                ) : (
                  <div style={styles.paymentNotice}>
                    Veuillez calculer vos frais de port pour activer le paiement.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Digital Kiff.</p>
      </footer>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  miniHeader: {
    width: '100%',
    borderBottom: '1px solid #2a2a2a',
    padding: '24px 0',
  },
  miniHeaderInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
  },
  backLink: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  main: {
    flexGrow: 1,
    padding: '128px 0',
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 64px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '64px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    lineHeight: '72px',
    marginBottom: '64px',
  },
  error: {
    padding: '16px',
    border: '1px solid #93000a',
    color: '#ffb4ab',
    backgroundColor: 'rgba(147, 0, 10, 0.1)',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '64px',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '64px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    lineHeight: '1.2',
    margin: 0,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px 32px',
  },
  formFull: {
    gridColumn: 'span 2',
  },
  formHalf: {
    gridColumn: 'span 1',
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #353534',
    borderRadius: 0,
    padding: '12px 0',
    color: 'var(--on-surface)',
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #353534',
    borderRadius: 0,
    padding: '12px 0',
    color: 'var(--on-surface)',
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
  },
  calcBtn: {
    width: '100%',
    padding: '16px',
    border: '2px solid var(--on-surface)',
    backgroundColor: 'transparent',
    color: 'var(--on-surface)',
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px',
  },
  ratesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  rateLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '1px solid #1A1A1A',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  rateLabelActive: {
    border: '1px solid var(--primary-container)',
  },
  radio: {
    accentColor: 'var(--accent)',
  },
  rateInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  rateName: {
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--on-surface)',
  },
  rateDays: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    color: 'var(--secondary)',
  },
  rateCost: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--accent)',
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  paypalBtn: {
    width: '100%',
    backgroundColor: '#FFC439',
    color: '#000',
    border: 'none',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s ease',
  },
  paypalText: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  cardBtn: {
    width: '100%',
    backgroundColor: '#2a2a2a',
    color: 'var(--on-surface)',
    border: '1px solid #353534',
    padding: '16px',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
  },
  rightCol: {
    borderLeft: '1px solid #2a2a2a',
    paddingLeft: '32px',
  },
  summaryCard: {
    position: 'sticky',
    top: '128px',
  },
  summaryTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    marginBottom: '24px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '32px',
  },
  summaryItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  itemThumb: {
    width: '80px',
    height: '96px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #353534',
    position: 'relative',
    flexShrink: 0,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(80%)',
    opacity: 0.8,
  },
  itemQty: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '24px',
    height: '24px',
    backgroundColor: 'var(--on-surface)',
    color: 'var(--base)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
    fontSize: '10px',
    fontWeight: 700,
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemName: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--on-surface)',
  },
  itemMeta: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    color: 'var(--secondary)',
  },
  itemPrice: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--on-surface)',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#2a2a2a',
    margin: '16px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
  },
  summaryLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--on-surface)',
  },
  summaryValue: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--on-surface)',
  },
  summaryValueMuted: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    color: 'var(--secondary)',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '16px 0',
  },
  totalLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--on-surface)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  totalValueWrap: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  totalCurrency: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    color: 'var(--secondary)',
  },
  totalValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '40px',
    fontWeight: 700,
    color: 'var(--accent)',
    letterSpacing: '-0.02em',
    lineHeight: '44px',
  },
  paymentNotice: {
    border: '1px dashed #2a2a2a',
    padding: '20px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--secondary)',
    marginTop: '20px',
  },
  footer: {
    width: '100%',
    borderTop: '1px solid #2a2a2a',
    padding: '24px 0',
    textAlign: 'center',
  },
  footerText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};