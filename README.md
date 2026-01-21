# RipVault

**Rip. Reveal. Glory.**

A premium trading card collection and marketplace platform built with Next.js that allows users to collect, manage, and build valuable collections from three major Trading Card Games (TCGs): Pokemon, Magic: The Gathering, and Yu-Gi-Oh!

## Overview

RipVault combines the excitement of "ripping" (opening) card packs with secure collection management, user wallets, and payment integration. Users can deposit funds into their wallet via Cashfree payments, purchase card packs at various price tiers, and view their complete collection.

## Features

### Authentication
- Google OAuth 2.0 integration via NextAuth.js
- Email-based magic link authentication via Resend
- JWT session strategy for persistent authentication
- Protected routes with session management
- User profile management

### Dashboard
- **Hero Carousel** - Autoplay image carousel showcasing featured cards and content
- **Pokemon Cards** - Browse Pokemon TCG cards with rarity and pricing info
- **Magic: The Gathering Cards** - Browse MTG cards with rarity-based color coding via Scryfall API
- **Yu-Gi-Oh! Cards** - Browse Yu-Gi-Oh! cards with type-based color badges

### Card Packs System
Purchase card packs across 4 tiers for each TCG:

| Tier | Cards | Price |
|------|-------|-------|
| Starter Pack | 3 cards | ₹50 |
| Premium Pack | 5 cards | ₹100 |
| Legend Pack | 7 cards | ₹200 |
| Grail Pack | 10 cards | ₹500 |

- 3D perspective card hover effects with mouse tracking
- Balance validation before purchase
- Real-time card fetching from TCG APIs
- Random card selection algorithm

### Collection Management
- View all collected cards in a responsive grid
- Filter by TCG type (Pokemon, MTG, Yu-Gi-Oh!)
- Display card metadata: name, image, rarity, type, TCG badge
- Collection stats showing card counts by TCG

### Wallet & Payment System
- Wallet balance display in sidebar
- Add funds functionality through Cashfree payment gateway
- Preset amount buttons (₹100, ₹500, ₹1,000, ₹5,000)
- Order creation and payment verification flow
- Transaction history tracking

### Sidebar Navigation
- Logo and branding
- Wallet section with real-time balance
- Navigation: Packs, Collection, Marketplace (coming soon)
- User profile and logout options
- Responsive design with mobile hamburger menu

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Authentication**: NextAuth.js v5
- **Database**: SQLite with Prisma ORM
- **Payment**: Cashfree SDK
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React, Tabler Icons

## API Integrations

| API | Endpoint | Description |
|-----|----------|-------------|
| Pokemon TCG | `api.pokemontcg.io` | Pokemon card data and images |
| Scryfall | `api.scryfall.com` | Magic: The Gathering cards |
| YGOPRODeck | `db.ygoprodeck.com` | Yu-Gi-Oh! card database |

## Project Structure

```
app/
├── (protected)/              # Protected routes requiring auth
│   ├── dashboard/
│   │   ├── page.tsx          # Main dashboard with carousels
│   │   ├── collection/       # User's card collection viewer
│   │   ├── packs/            # Card packs grid with purchase UI
│   │   └── profile/          # User profile page
│   └── payment/
│       └── callback/         # Payment verification callback
├── api/
│   ├── auth/[...nextauth]/   # NextAuth handler
│   ├── pokemon/cards/        # Pokemon TCG API proxy
│   ├── scryfall/cards/       # Scryfall API proxy
│   ├── yugioh/cards/         # Yu-Gi-Oh API proxy
│   ├── user/
│   │   ├── balance/          # Get user wallet balance
│   │   └── collection/       # Get user's collected cards
│   ├── payment/
│   │   ├── create-order/     # Create Cashfree payment order
│   │   └── verify/           # Verify payment & update balance
│   └── packs/
│       └── purchase/         # Purchase pack & add cards to collection
└── auth/                     # Authentication pages

components/
├── dashboard/
│   └── hero-carousel.tsx     # Autoplay carousel
├── layout/
│   └── app-sidebar.tsx       # Main sidebar navigation
├── pokemon/
│   └── pokemon-cards.tsx     # Pokemon card display
├── scryfall/
│   └── scryfall-cards.tsx    # MTG card display
├── yugioh/
│   └── yugioh-cards.tsx      # Yu-Gi-Oh card display
├── payment/
│   ├── add-funds-dialog.tsx  # Add funds modal
│   └── balance-display.tsx   # Wallet balance display
├── packs/
│   ├── packs-grid.tsx        # Grid layout for pack cards
│   └── pack-card.tsx         # Individual pack with 3D effects
└── ui/                       # shadcn/ui components

lib/
├── auth.ts                   # NextAuth configuration
├── prisma.ts                 # Prisma client singleton
├── cashfree.ts               # Cashfree API wrapper
├── packs.ts                  # Pack config & TCG type definitions
└── utils.ts                  # Utility functions

prisma/
├── schema.prisma             # Database schema
└── dev.db                    # SQLite development database
```

## Database Schema

Key models:
- **User** - Core user profile with balance tracking
- **CardTemplate** - Reusable card definitions from APIs
- **UserCard** - User's collection (links users to card templates)
- **Transaction** - Payment/wallet transactions
- **Pack** - Card pack definitions
- **PackPurchase** - Purchase history tracking

## Getting Started

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   # Database
   DATABASE_URL=file:./dev.db

   # Authentication
   AUTH_SECRET=your-auth-secret
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   AUTH_RESEND_KEY=your-resend-api-key
   FROM_EMAIL=noreply@yourdomain.com

   # Cashfree Payment Gateway
   CASHFREE_CLIENT_ID=your-cashfree-client-id
   CASHFREE_CLIENT_SECRET=your-cashfree-client-secret
   CASHFREE_API_BASE_URL=https://sandbox.cashfree.com/pg
   CASHFREE_RETURN_URL=http://localhost:3000/dashboard/payment/callback
   NEXT_PUBLIC_CASHFREE_MODE=sandbox
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Image Domains

The following external image domains are configured in `next.config.ts`:
- `lh3.googleusercontent.com` - Google profile images
- `images.unsplash.com` - Unsplash images
- `images.pokemontcg.io` - Pokemon card images
- `cards.scryfall.io` - MTG card images
- `images.ygoprodeck.com` - Yu-Gi-Oh card images

## Key Workflows

### Pack Purchase Flow
1. User views `/dashboard/packs`
2. Selects pack (TCG type + tier)
3. Balance check performed
4. Cards fetched from external APIs
5. Cards added to user's collection
6. Balance deducted atomically

### Payment Flow
1. User clicks "Deposit" → Add Funds dialog opens
2. Enters amount or selects preset
3. Cashfree payment session created
4. User completes payment on Cashfree gateway
5. Callback verifies payment
6. Balance updated on success
