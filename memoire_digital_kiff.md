# 🧠 Mémoire de Projet : Digital Kiff

Ce document sert de mémoire technique et de journal de bord pour la création de la boutique de design d'objets et d'art digital **Digital Kiff**.

---

## 📋 Choix d'Architecture & Décisions

### 1. Concept & Modèle Commercial
- **Boutique de Design Global** : La boutique présente des designs et visuels originaux appliqués sur une variété d'objets (art, art mural, art de la table, textile, accessoires). Le projet n'est pas restreint à une marque de streetwear (les vestes étaient simplement un produit test).
- **Production & Logistique** : Entièrement gérées par **Printful** à la demande.
- **Paiements** : Gérés par le SDK **PayPal** (PayPal + Cartes Bancaires intégrés).

### 2. Design System (Brutaliste Moderne)
- **Esthétique** : Brutaliste minimaliste, très épuré, fond sombre, absence d'arrondis et contrastes nets.
- **Couleurs** :
  - Fond : `#0A0A0A` (Noir profond)
  - Surface : `#131313` (Gris très foncé pour les conteneurs)
  - Accent : `#FF4D00` (Orange électrique)
  - Texte : `#e5e2e1` (Blanc cassé)
- **Typographies** : `Montserrat` (Titres en majuscules, gras) et `Inter` (Corps de texte).
- **Effets & Formes** :
  - `0px` border-radius partout (angles droits francs).
  - Bordures de 1px `#1A1A1A`.
  - Effets d'images : Grayscale (noir et blanc) par défaut, et passage aux couleurs (hover color) lors du survol.
  - Absence d'icônes génériques futiles ou d'éléments décoratifs superflus.

---

## 🔧 Configurations & Fichiers Créés

### 🔑 Clés de configuration
- **Printful API Key** : Configurée et testée avec succès en local.
- **Store ID** : `18393884` (Store "digital kiff" lié à la clé).
- **PayPal Configuration** : SDK configuré et opérationnel pour accepter les paiements par compte PayPal et Cartes Bancaires.

### 📦 Structure et Fichiers de l'App Next.js
1. **globals.css** : Style brutaliste complet (Montserrat + Inter, variables de couleur, réinitialisation, survol des images en noir et blanc vers couleur).
2. **layout.tsx** : Structure générale du site avec le Header global (Navbar) et le Footer brutaliste.
3. **Navbar.tsx** : Logo orange minimaliste, navigation simple et compteur de panier dynamique basé sur le `localStorage`.
4. **Footer.tsx** : Signature de marque minimaliste, mentions légales et propulsé par Printful.
5. **page.tsx** (Accueil) : Titre d'en-tête géant "DIGITAL KIFF - STUDIO DE DESIGN & OBJETS", section "Dernières Pièces" avec grille de produits à survol coloré, et section approche stylistique.
6. **shop/page.tsx** (Boutique) : Filtre par catégories épuré (Tout / Vestes / T-shirts / Accessoires) et grille de produits avec double bouton d'action (`+ Panier` et `Commander`).
7. **product/[id]/page.tsx** (Fiche Produit) : Galerie d'images interactive (multi-angles), choix de tailles, sélecteur de quantité et intégration du panier.
8. **cart/page.tsx** (Panier) : Visualisation des pièces ajoutées avec photos couleur au hover, résumé des coûts et bouton de paiement.
9. **checkout/page.tsx** (Paiement) : Formulaire d'adresse et de contact minimaliste avec intégration directe des boutons SDK PayPal/Card.
10. **order/[id]/page.tsx** (Confirmation) : Écran minimal de remerciement pour le client avec le numéro de référence.

---

## 🚀 Statut du Build & Compilation
- **Vérification de compilation** : Le projet compile à 100 % avec succès via `npm run build` sans aucune erreur TypeScript ou de rendu Next.js.
- Les routes dynamiques (`/api/products`, `/product/[id]`, `/order/[id]`) et statiques (`/`, `/shop`, `/cart`, `/checkout`) sont optimisées et opérationnelles.
