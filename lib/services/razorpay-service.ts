import Razorpay from "razorpay"
import crypto from "crypto"

// Initialize Razorpay
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

// Create a Razorpay order
export async function createRazorpayOrder(options: {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}) {
  try {
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

// Verify Razorpay payment
export function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string): boolean {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex")

  return generatedSignature === signature
}

// Fetch a Razorpay order
export async function fetchRazorpayOrder(orderId: string) {
  try {
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.fetch(orderId)
    return order
  } catch (error) {
    console.error("Error fetching Razorpay order:", error)
    throw error
  }
}

// Fetch a Razorpay payment
export async function fetchRazorpayPayment(paymentId: string) {
  try {
    const razorpay = getRazorpayInstance()
    const payment = await razorpay.payments.fetch(paymentId)
    return payment
  } catch (error) {
    console.error("Error fetching Razorpay payment:", error)
    throw error
  }
}
