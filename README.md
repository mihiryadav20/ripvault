# RipVault

A trading card collection platform built with Next.js that allows users to browse, collect, and manage cards from Pokemon TCG, Magic: The Gathering, and Yu-Gi-Oh!

## Features

### Authentication
- Google OAuth integration via NextAuth
- Protected routes with session management
- User profile management

### Dashboard
- **Hero Carousel** - Autoplay image carousel showcasing featured content
- **Pokemon Cards** - Browse Pokemon TCG cards with horizontal scrolling
- **Magic: The Gathering Cards** - Browse MTG cards via Scryfall API
- **Yu-Gi-Oh! Cards** - Browse Yu-Gi-Oh! cards with color-coded type badges

### Sidebar Navigation
- Wallet balance display with deposit functionality
- Navigation: Packs, Collection, Marketplace (coming soon)
- User profile and logout options
- Responsive design with mobile hamburger menu

### Payment Integration
- Cashfree payment gateway integration
- Add funds to wallet functionality

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Drizzle ORM
- **Payment**: Cashfree SDK
- **Font**: Geist (Sans & Mono)

## API Integrations

| API | Endpoint | Description |
|-----|----------|-------------|
| Pokemon TCG | `pokemontcg.io` | Pokemon card data and images |
| Scryfall | `api.scryfall.com` | Magic: The Gathering cards |
| YGOPRODeck | `db.ygoprodeck.com` | Yu-Gi-Oh! card database |

## Project Structure

```
app/
├── (protected)/           # Protected routes requiring auth
│   ├── dashboard/         # Main dashboard
│   │   ├── collection/    # User's card collection
│   │   ├── packs/         # Card packs
│   │   └── profile/       # User profile
│   └── layout.tsx         # Sidebar layout wrapper
├── api/
│   ├── pokemon/cards/     # Pokemon TCG API route
│   ├── scryfall/cards/    # Scryfall API route
│   ├── yugioh/cards/      # Yu-Gi-Oh API route
│   └── user/              # User-related endpoints
└── auth/                  # Authentication pages

components/
├── dashboard/             # Dashboard-specific components
│   └── hero-carousel.tsx  # Autoplay carousel
├── layout/
│   └── app-sidebar.tsx    # Main sidebar navigation
├── pokemon/
│   └── pokemon-cards.tsx  # Pokemon card display
├── scryfall/
│   └── scryfall-cards.tsx # MTG card display
├── yugioh/
│   └── yugioh-cards.tsx   # Yu-Gi-Oh card display
└── ui/                    # shadcn/ui components
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   DATABASE_URL=
   AUTH_SECRET=
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=
   CASHFREE_APP_ID=
   CASHFREE_SECRET_KEY=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Image Domains

The following external image domains are configured in `next.config.ts`:
- `lh3.googleusercontent.com` - Google profile images
- `images.unsplash.com` - Unsplash images
- `images.pokemontcg.io` - Pokemon card images
- `cards.scryfall.io` - MTG card images
- `images.ygoprodeck.com` - Yu-Gi-Oh card images
