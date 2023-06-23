"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function StripePage() {
    return (
        <Elements stripe={stripePromise}>
            Stripe
        </Elements>
    )
}