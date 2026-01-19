const CASHFREE_API_BASE = process.env.CASHFREE_API_BASE_URL || "https://sandbox.cashfree.com"
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID!
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET!
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || "2025-01-01"

interface CreateOrderParams {
  orderId: string
  orderAmount: number
  customerEmail: string
  customerPhone: string
  customerId: string
  customerName?: string
  returnUrl: string
}

interface CashfreeOrderResponse {
  cf_order_id: string
  order_id: string
  order_status: string
  order_token: string
  payment_session_id: string
}

interface CashfreePaymentResponse {
  cf_order_id: string
  order_id: string
  order_status: string
  order_amount: number
  order_currency: string
  payments?: {
    cf_payment_id: string
    payment_status: string
    payment_amount: number
    payment_method: {
      [key: string]: unknown
    }
  }[]
}

export async function createCashfreeOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
  const response = await fetch(`${CASHFREE_API_BASE}/pg/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": CASHFREE_CLIENT_ID,
      "x-client-secret": CASHFREE_CLIENT_SECRET,
    },
    body: JSON.stringify({
      order_id: params.orderId,
      order_amount: params.orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: params.customerId,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
        customer_name: params.customerName || "Customer",
      },
      order_meta: {
        return_url: params.returnUrl,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("Cashfree order creation failed:", error)
    throw new Error(error.message || "Failed to create order")
  }

  return response.json()
}

export async function getCashfreeOrderStatus(orderId: string): Promise<CashfreePaymentResponse> {
  const response = await fetch(`${CASHFREE_API_BASE}/pg/orders/${orderId}`, {
    method: "GET",
    headers: {
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": CASHFREE_CLIENT_ID,
      "x-client-secret": CASHFREE_CLIENT_SECRET,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("Cashfree order status check failed:", error)
    throw new Error(error.message || "Failed to get order status")
  }

  return response.json()
}

export async function getPaymentDetails(orderId: string) {
  const response = await fetch(`${CASHFREE_API_BASE}/pg/orders/${orderId}/payments`, {
    method: "GET",
    headers: {
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": CASHFREE_CLIENT_ID,
      "x-client-secret": CASHFREE_CLIENT_SECRET,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("Cashfree payment details fetch failed:", error)
    throw new Error(error.message || "Failed to get payment details")
  }

  return response.json()
}
