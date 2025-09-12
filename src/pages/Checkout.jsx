import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function CheckoutForm({ clientSecret, plan, publishableKey }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  console.log(plan, "Plan details in checkout form");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Optional: where to redirect after off-session payments (like UPI, wallets)
        return_url: `${window.location.origin}/payment-status?publishableKey=${publishableKey}&payment_intent_client_secret=${clientSecret}&plan_price=${plan.price_amount}`,
      },
    });

    console.log(paymentIntent, "Payment Intent details.........................");

    if (error) {
      setMessage(error.message);
      console.log(error)
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage(`✅ Payment successful for ${plan.name}`);

      // 🔹 Inform backend to activate the plan
      // await fetch("/activate-plan", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     plan_id: plan.id,
      //     payment_intent_id: paymentIntent.id,
      //   }),
      // });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-50">
      {/* Stripe auto-renders all available methods here */}
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Processing..." : `Pay $${plan.price_amount}`}
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </form>
  );
}
