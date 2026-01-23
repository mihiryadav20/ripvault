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

### Landing Page
- Animated pack carousels showcasing tiers across all supported TCGs
- Clickable pack cards open a details dialog
- CTA in dialog: **Login to Buy** → redirects to `/auth/login?callbackUrl=/dashboard/packs`

### Dashboard
- `/dashboard` redirects to `/dashboard/packs`
- **Packs** - Purchase packs across tiers for each TCG
- **Card List** - Browse the card list page at `/dashboard/cardlist`
- **Collection** - View your owned cards at `/dashboard/collection`

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
- Navigation: Packs, Card List, Collection, Marketplace (coming soon)
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
│   │   ├── page.tsx          # Redirects to /dashboard/packs
│   │   ├── cardlist/         # Card list page (moved from /dashboard)
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
│   ├── pack-card.tsx         # Individual pack with 3D effects
│   └── animated-pack-card.tsx # Landing page pack card w/ same 3D effects
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

## Architecture

### State Management
- **Balance Context** - React Context for real-time wallet balance updates across components
- **Server Sessions** - NextAuth.js JWT strategy for persistent authentication
- **Client-side Fetching** - Custom hooks for data loading with loading states

### Database Transactions
- **Atomic Operations** - Pack purchases use Prisma transactions to ensure data integrity
- **Upsert Pattern** - CardTemplate records are upserted to avoid duplicates across purchases
- **Balance Consistency** - Balance deductions and card additions happen in a single transaction

### 3D Card Effects
- Mouse-tracked 3D transforms using `perspective(1000px)` with `rotateX/rotateY`
- `requestAnimationFrame` for smooth 60fps animations
- Applied to both landing page carousels and dashboard pack cards

## Key Workflows

### 1. Authentication Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Landing Page   │────▶│   /auth/login    │────▶│   Dashboard     │
│       /         │     │  Google OAuth    │     │ /dashboard/packs│
│                 │     │  Email Magic Link│     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

1. User lands on `/` (landing page with animated pack carousels)
2. Clicks "Get Started" or clicks a pack → "Login to Buy"
3. Redirected to `/auth/login`
4. Chooses authentication method:
   - **Google OAuth** - One-click sign in
   - **Email Magic Link** - Passwordless authentication via Resend
5. On success, redirected to `/dashboard/packs`
6. Session persisted via JWT tokens

### 2. Pack Purchase Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Select Pack  │───▶│ Balance Check│───▶│ Fetch Cards  │───▶│ Add to       │
│ (TCG + Tier) │    │              │    │ from TCG API │    │ Collection   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

**Detailed Steps:**
1. User views `/dashboard/packs` - Grid organized by TCG (Pokemon, MTG, Yu-Gi-Oh!)
2. Each pack displays: tier name, card count, price, 3D hover effect
3. User clicks "Purchase" button
4. **Balance Validation** - Server checks if `user.balance >= pack.price`
5. **Card Fetching** - Random cards fetched from external APIs:
   - Pokemon: `api.pokemontcg.io/v2/cards` (random page selection)
   - MTG: `api.scryfall.com/cards/search` (random color query)
   - Yu-Gi-Oh!: `db.ygoprodeck.com/api/v7/cardinfo.php` (random offset)
6. **Card Randomization** - Fisher-Yates shuffle applied to results
7. **Database Transaction** (atomic):
   - Upsert CardTemplate records for each card
   - Create UserCard entries linking user to cards
   - Decrement user balance
8. Success toast displays received cards
9. Cards immediately viewable in `/dashboard/collection`

### 3. Wallet & Payment Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Click Deposit│───▶│ Enter Amount │───▶│ Cashfree     │───▶│ Balance      │
│ in Sidebar   │    │ (₹100-₹5000)│    │ Payment Page │    │ Updated      │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

**Detailed Steps:**
1. User clicks "Deposit" button in sidebar → Add Funds dialog opens
2. User enters custom amount or selects preset (₹100, ₹500, ₹1,000, ₹5,000)
3. Clicks "Pay" → `/api/payment/create-order` called
4. **Order Creation:**
   - Transaction record created with `PENDING` status
   - Cashfree order created via SDK
   - Payment session URL returned
5. User redirected to Cashfree payment gateway
6. User completes payment (UPI, Card, Net Banking, etc.)
7. Cashfree redirects to `/dashboard/payment/callback?order_id=...`
8. **Payment Verification:**
   - `/api/payment/verify` checks status with Cashfree
   - If `PAID`: Transaction marked `SUCCESS`, balance incremented
   - If `FAILED`: Transaction marked `FAILED`
9. User redirected to `/dashboard/packs` with updated balance
10. Balance Context refreshes across all components

### 4. Collection Viewing Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Navigate to  │───▶│ Fetch Cards  │───▶│ Display Grid │
│ /collection  │    │ from API     │    │ with Filters │
└──────────────┘    └──────────────┘    └──────────────┘
```

**Features:**
1. User navigates to `/dashboard/collection`
2. `/api/user/collection` fetches all UserCard entries with CardTemplate data
3. Cards displayed in responsive grid (2-6 columns based on viewport)
4. **Filter Options:**
   - All cards
   - Pokemon only
   - MTG only
   - Yu-Gi-Oh! only
5. Each card shows: image, name, TCG badge, rarity
6. Collection stats display count per TCG

## Development Status

### Completed Features
- Authentication (Google OAuth + Email Magic Links)
- Card pack system (3 TCGs × 4 tiers = 12 pack variants)
- Collection management with filtering
- Wallet and Cashfree payment integration
- Dashboard with animated sidebar navigation
- 3D perspective hover effects on pack cards
- Responsive design with mobile support

### Coming Soon
- **Marketplace** - Trade cards with other collectors
- **Card Details Modal** - View detailed card information
- **Trading System** - Peer-to-peer card trading
