import React from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./Checkout";

export default function PaymentPage() {
  const { state } = useLocation();
  if (!state) return <p>❌ Invalid Payment Flow</p>;

  const { clientSecret, publishableKey, plan } = state;
  const stripePromise = loadStripe(publishableKey);

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  console.log(clientSecret, publishableKey, plan, "💳 Payment details");

  return (
    <div className="p-6 max-w-lg mx-auto mt-40">
      <h2 className="text-2xl font-bold mb-4">
        Pay ${plan.price_amount} for {plan.name}
      </h2>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm clientSecret={clientSecret} plan={plan} publishableKey={publishableKey} />
      </Elements>
    </div>
  );
}
