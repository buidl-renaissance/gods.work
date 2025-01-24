'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"

export default function CheckoutForm({ email }: { email: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        receipt_email: email,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? 'An unknown error occurred')
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600">Checkout for: <strong>{email}</strong></p>
      </div>
      <PaymentElement />
      <Button disabled={isProcessing || !stripe || !elements} className="w-full">
        {isProcessing ? "Processing..." : "Pay now"}
      </Button>
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </form>
  )
}

