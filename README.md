# Atypic Cactus - E-commerce Site

Refonte du site e-commerce Atypic Cactus - Boutique en ligne spécialisée dans la vente de cactus.

## Features

- 🌵 Catalogue de cactus avec filtres par espèce
- 🛒 Système de panier complet avec persistance localStorage
- 📦 Calcul automatique des frais de port (gratuit > 200€)
- 📱 Interface responsive et moderne
- 🎨 Design épuré avec animations CSS

## Tech Stack

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- **Framework**: Next.js 14 (App Router)
- **Styling**: CSS Modules + Tailwind CSS
- **State Management**: React Context API
- **Storage**: localStorage pour la persistance du panier
- **Deployment**: Optimisé pour Vercel

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── api/checkout/          # API endpoint pour commandes
│   ├── produit/               # Pages produits
│   │   ├── cereus/
│   │   ├── echinocactus/
│   │   └── opuntia/
│   └── commande/              # Page de commande
├── components/
│   └── CartContext.tsx        # Context global du panier
└── styles/                    # Styles CSS modules
```

## Features Details

### Cart System
- Add/remove products with quantity management
- Real-time total calculation
- Automatic shipping calculation
- Persistent across browser sessions

### Product Pages
- Detailed product information
- Image galleries
- Size/price variants
- Integrated cart functionality

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
