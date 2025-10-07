import React, { useState, useEffect, useMemo } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { changePaymentMethodAPI } from "../services/pricing.service";
import PaymentPopup from "../components/PaymentPopup";

// Read Vite env correctly (must start with VITE_)
const FALLBACK_PUBLISHABLE_STRIPE_KEY = import.meta.env
  .VITE_PUBLISHABLE_STRIPE_KEY;

function PaymentForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setPopupContent({
        image: "/payment-ussuccessfull.png",
        title: "Payment Method Update Failed",
        description: "Stripe has not loaded yet. Please wait a moment and try again.",
        details: [
          { label: "Status", value: "FAILED" },
          { label: "Error", value: "Stripe not initialized" }
        ],
        buttons: [{ type: "button", text: "Try Again", onClick: () => setShowPopup(false) }]
      });
      setShowPopup(true);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPopupContent({
        image: "/payment-ussuccessfull.png",
        title: "Payment Method Update Failed",
        description: "Card element not found. Please refresh the page.",
        details: [
          { label: "Status", value: "FAILED" },
          { label: "Error", value: "Card element missing" }
        ],
        buttons: [{ type: "button", text: "Try Again", onClick: () => setShowPopup(false) }]
      });
      setShowPopup(true);
      setLoading(false);
      return;
    }

    const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: "Pratham Meena" },
      },
    });

    if (error) {
      console.error("Payment method update error:", error);
      setPopupContent({
        image: "/payment-ussuccessfull.png",
        title: "Payment Method Update Failed",
        description: error.message || "We're sorry, your payment method could not be updated.",
        details: [
          { label: "Error Code", value: error.code || "UNKNOWN_ERROR" },
          { label: "Status", value: "FAILED" },
          { label: "Date", value: new Date().toLocaleDateString('en-GB') }
        ],
        buttons: [{ type: "button", text: "Try Again", onClick: () => setShowPopup(false) }],
        note: {
          text: "If the issue continues, contact our support team at",
          email: "support@bidinsight.com",
        }
      });
      setShowPopup(true);
      setLoading(false);
    } else {
      console.log("Setup successful:", setupIntent);
      setPopupContent({
        image: "/payment-successfull.png",
        title: "Payment Method Updated Successfully",
        details: [
          { label: "Payment Method ID", value: setupIntent.payment_method || "N/A" },
          { label: "Updated Date", value: new Date().toLocaleDateString('en-GB') },
          { label: "Status", value: "COMPLETED" }
        ],
        buttons: [{ type: "link", text: "Go to Dashboard", url: "/dashboard" }]
      });
      setShowPopup(true);
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="min-h-[60vh] w-full flex flex-col gap-4 justify-center items-center p-4"
      >
        <div className="w-full max-w-md">
          <label className="block mb-2 text-sm font-medium text-gray-200">
            Card details
          </label>
          <div className="w-full rounded border border-gray-300 bg-white px-3 py-3 text-black shadow-sm">
            <CardElement
              options={{
                style: {
                  base: { fontSize: "16px", color: "#111827" },
                  invalid: { color: "#EF4444" },
                },
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700 transition-colors"
        >
          {loading ? "Saving..." : "Save Payment Method"}
        </button>
      </form>

      {showPopup && popupContent && (
        <PaymentPopup
          content={popupContent}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export default function ChangePaymentMethod() {
  const [clientSecret, setClientSecret] = useState(null);
  const [publishableKey, setPublishableKey] = useState(
    FALLBACK_PUBLISHABLE_STRIPE_KEY || ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await changePaymentMethodAPI();
        console.log("changePaymentMethodAPI response:", response);
        if (response?.client_secret) setClientSecret(response.client_secret);
        if (response?.publishable_key)
          setPublishableKey(response.publishable_key);
      } catch (err) {
        console.error("Error fetching client secret:", err);
        setError("Failed to initialize payment. Please try again later.");
      }
    };
    fetchClientSecret();
  }, []);

  const stripePromise = useMemo(() => {
    if (!publishableKey) return null; // Avoid calling loadStripe with undefined
    return loadStripe(publishableKey);
  }, [publishableKey]);

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!clientSecret) {
    return <p className="p-6">Loading payment form...</p>;
  }

  if (!stripePromise) {
    return (
      <div className="p-6 text-yellow-500">
        Missing Stripe publishable key. Set VITE_STRIPE_PUBLISHABLE_KEY or have
        the API return publishable_key.
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen z-10 flex items-center justify-center bg-black/50">
      <div className="bg-blue max-w-2xl w-full rounded-xl">
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
}
