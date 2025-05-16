import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createRazorpayOrder } from "@/lib/services/razorpay-service"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, currency, receipt, notes } = body

    if (!amount || !currency || !receipt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await createRazorpayOrder({
      amount,
      currency,
      receipt,
      notes: {
        ...notes,
        userId: session.user.id,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
