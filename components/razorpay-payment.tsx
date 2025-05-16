"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface RazorpayPaymentProps {
  itemId: string
  itemType: "course" | "webinar" | "webinar_recording"
  amount: number
  name: string
  description: string
  buttonText?: string
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  buttonClassName?: string
  onSuccess?: () => void
  onError?: (error: any) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPayment({
  itemId,
  itemType,
  amount,
  name,
  description,
  buttonText = "Pay Now",
  buttonVariant = "default",
  buttonClassName = "",
  onSuccess,
  onError,
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await loadRazorpayScript()
      }

      // Create order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            productId: itemId,
            productType: itemType,
            productName: name,
          },
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await orderResponse.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StockEdu",
        description,
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verificationResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const verificationData = await verificationResponse.json()

            if (verificationData.success) {
              toast({
                title: "Payment Successful",
                description: `You have successfully purchased ${name}`,
              })

              // Redirect based on product type
              if (itemType === "course") {
                router.push(`/student/courses/${itemId}`)
              } else if (itemType === "webinar" || itemType === "webinar_recording") {
                router.push(`/student/webinars/${itemId}`)
              }

              // Refresh the page to update UI
              router.refresh()

              if (onSuccess) onSuccess()
            } else {
              toast({
                title: "Payment verification failed",
                description: verificationData.error || "Please try again or contact support.",
                variant: "destructive",
              })
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast({
              title: "Payment Verification Failed",
              description: "Your payment was processed but verification failed. Please contact support.",
              variant: "destructive",
            })
            if (onError) onError(error)
          } finally {
            setIsLoading(false)
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      if (onError) onError(error)
      setIsLoading(false)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = resolve
      document.body.appendChild(script)
    })
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading} variant={buttonVariant as any} className={buttonClassName}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  )
}
