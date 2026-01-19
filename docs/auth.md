# Authentication System

## Overview

RIP Vault uses **Auth.js v5** (NextAuth) for authentication with two sign-in methods:
- **Google OAuth** - One-click sign in with Google account
- **Magic Link** - Passwordless email authentication via Resend

## Tech Stack

| Component | Technology |
|-----------|------------|
| Auth Library | Auth.js v5 (next-auth@beta) |
| Database | Prisma 7 + SQLite |
| Email Provider | Resend |
| Session Strategy | JWT (Edge-compatible) |

## File Structure

```
├── lib/
│   ├── auth.ts              # Main Auth.js config with providers
│   ├── auth.config.ts       # Edge-compatible config for middleware
│   └── prisma.ts            # Prisma client singleton
├── app/
│   ├── api/auth/
│   │   └── [...nextauth]/
│   │       └── route.ts     # Auth API route handler
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx     # Login page (split layout)
│   │   ├── verify-request/
│   │   │   └── page.tsx     # "Check your email" page
│   │   └── error/
│   │       └── page.tsx     # Auth error page
│   └── (protected)/
│       ├── layout.tsx       # Protected layout with session check
│       └── dashboard/
│           └── page.tsx     # Dashboard (requires auth)
├── components/auth/
│   ├── login-form.tsx       # Login form with email + Google
│   └── user-button.tsx      # User avatar + sign out
├── middleware.ts            # Route protection
└── types/next-auth.d.ts     # TypeScript extensions
```

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  balance       Float     @default(0)
  accounts      Account[]
  sessions      Session[]
  transactions  Transaction[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // ... OAuth tokens
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
}
```

## Authentication Flow

### Google OAuth
```
1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. Google redirects to /api/auth/callback/google
4. Auth.js creates/updates user in database
5. JWT session created
6. User redirected to /dashboard
```

### Magic Link
```
1. User enters email, clicks "Continue with Magic Link"
2. Auth.js generates verification token (stored in DB)
3. Resend sends email with sign-in link
4. User redirected to /auth/verify-request
5. User clicks link in email
6. Auth.js validates token, creates session
7. User redirected to /dashboard
```

## Route Protection

### Middleware (`middleware.ts`)
- Runs on Edge runtime for fast auth checks
- Protects `/dashboard/*` routes
- Redirects authenticated users away from `/auth/*`

### Server-Side (`(protected)/layout.tsx`)
- Double-checks session on protected pages
- Provides session context to children

## Environment Variables

```env
# Required
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>
AUTH_RESEND_KEY=<resend-api-key>
AUTH_URL=http://localhost:3000

# Optional
FROM_EMAIL=noreply@yourdomain.com
```

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page |
| `/auth/login` | Public | Login page |
| `/auth/verify-request` | Public | Magic link sent confirmation |
| `/auth/error` | Public | Auth error display |
| `/dashboard` | Protected | User dashboard |
| `/api/auth/*` | Public | Auth.js API routes |

## Usage

### Get Session (Server Component)
```tsx
import { auth } from "@/lib/auth"

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  return <div>Hello {session.user.name}</div>
}
```

### Get Session (Client Component)
```tsx
"use client"
import { useSession } from "next-auth/react"

export function Component() {
  const { data: session } = useSession()
  return <div>Hello {session?.user?.name}</div>
}
```

### Sign In/Out
```tsx
import { signIn, signOut } from "next-auth/react"

// Sign in with Google
signIn("google", { callbackUrl: "/dashboard" })

// Sign in with Magic Link
signIn("resend", { email, callbackUrl: "/dashboard" })

// Sign out
signOut({ redirectTo: "/" })
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy Client ID and Secret to `.env`

## Resend Setup

1. Sign up at [Resend](https://resend.com)
2. Verify your domain (for production)
3. Create API key
4. Add to `.env` as `AUTH_RESEND_KEY`
