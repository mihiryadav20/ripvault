# Cashfree Payment Gateway Integration

## Overview

RIP Vault integrates **Cashfree PG** (Payment Gateway) for adding funds to user wallets. Users can add money via various payment methods (UPI, Cards, NetBanking, Wallets) through Cashfree's checkout.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Payment Gateway | Cashfree PG (Sandbox/Production) |
| Checkout | Cashfree JS SDK v3 |
| Database | Prisma 7 + SQLite |
| API | Next.js Route Handlers |

## File Structure

```
├── lib/
│   └── cashfree.ts              # Cashfree API utilities
├── app/
│   ├── api/
│   │   ├── payment/
│   │   │   ├── create-order/
│   │   │   │   └── route.ts     # Creates Cashfree order
│   │   │   └── verify/
│   │   │       └── route.ts     # Verifies payment status
│   │   └── user/
│   │       └── balance/
│   │           └── route.ts     # Fetches user balance
│   └── (protected)/
│       ├── dashboard/
│       │   └── page.tsx         # Dashboard with balance display
│       └── payment/
│           └── callback/
│               └── page.tsx     # Payment verification page
├── components/payment/
│   ├── balance-display.tsx      # Shows balance + refresh
│   └── add-funds-dialog.tsx     # Add funds modal
```

## Database Schema

```prisma
model User {
  id            String        @id @default(cuid())
  // ... other fields
  balance       Float         @default(0)
  transactions  Transaction[]
}

model Transaction {
  id               String   @id @default(cuid())
  userId           String
  orderId          String   @unique
  amount           Float
  currency         String   @default("INR")
  status           String   @default("PENDING")
  paymentSessionId String?
  cfOrderId        String?
  paymentMethod    String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Payment Flow

```
1. User clicks "Add Funds" on dashboard
2. Enters amount (or selects preset: ₹100, ₹500, ₹1000, ₹5000)
3. Frontend calls POST /api/payment/create-order
4. Backend creates order with Cashfree API
5. Transaction record created in DB (status: PENDING)
6. Frontend initializes Cashfree checkout with payment_session_id
7. User completes payment on Cashfree checkout
8. Cashfree redirects to /payment/callback?order_id=xxx
9. Callback page calls POST /api/payment/verify
10. Backend verifies order status with Cashfree API
11. If PAID: Update transaction status + increment user balance
12. User sees success/failure message
```

## API Endpoints

### POST `/api/payment/create-order`
Creates a new Cashfree order and transaction record.

**Request:**
```json
{
  "amount": 500
}
```

**Response:**
```json
{
  "orderId": "order_1705123456789_abc123",
  "paymentSessionId": "session_xxx",
  "cfOrderId": "cf_order_xxx"
}
```

### POST `/api/payment/verify`
Verifies payment status and updates balance if successful.

**Request:**
```json
{
  "orderId": "order_1705123456789_abc123"
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Payment verified and balance updated"
}
```

### GET `/api/user/balance`
Returns current user balance.

**Response:**
```json
{
  "balance": 1500.00
}
```

## Environment Variables

```env
# Cashfree credentials (get from Cashfree Dashboard)
CASHFREE_CLIENT_ID=TEST102120995ffcc706a8e36982ca9f99021201
CASHFREE_CLIENT_SECRET=cfsk_ma_test_xxxxx
CASHFREE_API_BASE_URL=https://sandbox.cashfree.com
CASHFREE_API_VERSION=2025-01-01
CASHFREE_RETURN_URL=http://localhost:3000/payment/callback

# Public (exposed to client)
NEXT_PUBLIC_CASHFREE_MODE=sandbox
```

## Cashfree API Functions

### `createCashfreeOrder()`
Creates an order with Cashfree PG API.

```typescript
const order = await createCashfreeOrder({
  orderId: "order_123",
  orderAmount: 500,
  customerEmail: "user@example.com",
  customerPhone: "9999999999",
  customerId: "user_id",
  customerName: "John Doe",
  returnUrl: "http://localhost:3000/payment/callback?order_id=order_123"
})
```

### `getCashfreeOrderStatus()`
Fetches order status from Cashfree.

```typescript
const status = await getCashfreeOrderStatus("order_123")
// Returns: { order_status: "PAID" | "PENDING" | "EXPIRED" | ... }
```

## Frontend Components

### BalanceDisplay
Shows current balance with refresh button and "Add Funds" trigger.

```tsx
<BalanceDisplay />
```

### AddFundsDialog
Modal for entering amount and initiating payment.

```tsx
<AddFundsDialog onSuccess={() => refetchBalance()} />
```

## Cashfree Dashboard Setup

1. Sign up at [Cashfree](https://merchant.cashfree.com)
2. Complete KYC (for production)
3. Go to **Developers** → **API Keys**
4. Copy **App ID** and **Secret Key**
5. For sandbox, use sandbox credentials
6. Add to `.env` file

## Testing in Sandbox

Cashfree sandbox supports test cards and UPI:

### Test Cards
| Card Number | Expiry | CVV | Result |
|-------------|--------|-----|--------|
| 4111111111111111 | Any future | Any 3 digits | Success |
| 4111111111111111 | Any future | 123 | Failure |

### Test UPI
- Use any UPI ID ending with `@ybl` for success
- Use `failure@ybl` for failure

## Production Checklist

- [ ] Switch to production Cashfree credentials
- [ ] Update `CASHFREE_API_BASE_URL` to `https://api.cashfree.com`
- [ ] Update `NEXT_PUBLIC_CASHFREE_MODE` to `production`
- [ ] Update `CASHFREE_RETURN_URL` to production domain
- [ ] Enable webhooks for reliable status updates
- [ ] Add error handling for edge cases
- [ ] Implement idempotency for payment verification

## Transaction States

| Status | Description |
|--------|-------------|
| PENDING | Order created, payment not completed |
| SUCCESS | Payment successful, balance updated |
| FAILED | Payment failed or expired |

## Security Considerations

1. **Server-side order creation** - Orders are created server-side with authenticated user
2. **Verification before balance update** - Balance only updates after Cashfree confirms payment
3. **User ownership check** - Verify transaction belongs to requesting user
4. **Idempotent verification** - Already successful transactions return early
5. **Secrets in env** - Cashfree credentials never exposed to client
