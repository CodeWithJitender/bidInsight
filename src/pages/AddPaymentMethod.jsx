import React, { useState, useMemo } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentPopup from "../components/PaymentPopup";

// Read Vite env correctly (must start with VITE_)
const FALLBACK_PUBLISHABLE_STRIPE_KEY = import.meta.env
  .VITE_PUBLISHABLE_STRIPE_KEY;

function PaymentForm({ clientSecret, onSuccess, onCancel }) {
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
        title: "Failed to Add Payment Method",
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
        title: "Failed to Add Payment Method",
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
        billing_details: { 
          name: "Customer Name" // You can pass this as a prop if needed
        },
      },
    });

    if (error) {
      console.error("Add payment method error:", error);
      setPopupContent({
        image: "/payment-ussuccessfull.png",
        title: "Failed to Add Payment Method",
        description: error.message || "We're sorry, your payment method could not be added.",
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
      console.log("Payment method added successfully:", setupIntent);
      setPopupContent({
        image: "/payment-successfull.png",
        title: "Payment Method Added Successfully",
        description: "Your card has been saved for autopay.",
        details: [
          { label: "Payment Method ID", value: setupIntent.payment_method || "N/A" },
          { label: "Added Date", value: new Date().toLocaleDateString('en-GB') },
          { label: "Status", value: "COMPLETED" }
        ],
        buttons: [
          { 
            type: "button", 
            text: "Done", 
            onClick: () => {
              setShowPopup(false);
              if (onSuccess) onSuccess(setupIntent);
            }
          }
        ]
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
        <div className="w-full">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Add Payment Method</h2>
          <p className="text-gray-300 text-center mb-6">Save your card for automatic payments</p>
        </div>

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

        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 rounded border border-gray-300 text-white disabled:opacity-60 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!stripe || loading}
            className="px-6 py-2 rounded bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700 transition-colors"
          >
            {loading ? "Saving..." : "Add Card"}
          </button>
        </div>
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

export default function AddPaymentMethod({ 
  clientSecret, 
  onSuccess, 
  onCancel 
}) {
  const [error, setError] = useState("");

  // Use provided publishable key or fallback to env
  const finalPublishableKey = FALLBACK_PUBLISHABLE_STRIPE_KEY;

  const stripePromise = useMemo(() => {
    if (!finalPublishableKey) return null;
    return loadStripe(finalPublishableKey);
  }, [finalPublishableKey]);

  if (error) {
    return (
      <div className="fixed top-0 left-0 w-full min-h-screen z-10 flex items-center justify-center bg-black/50">
        <div className="bg-blue max-w-2xl w-full rounded-xl p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="fixed top-0 left-0 w-full min-h-screen z-10 flex items-center justify-center bg-black/50">
        <div className="bg-blue max-w-2xl w-full rounded-xl p-6">
          <p className="text-white">Loading payment form...</p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="fixed top-0 left-0 w-full min-h-screen z-10 flex items-center justify-center bg-black/50">
        <div className="bg-blue max-w-2xl w-full rounded-xl p-6">
          <p className="text-yellow-500">
            Missing Stripe publishable key. Set VITE_STRIPE_PUBLISHABLE_KEY or pass publishableKey prop.
          </p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen z-50 flex items-center justify-center bg-black/50">
      <div className="bg-blue max-w-2xl w-full rounded-xl">
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm 
            clientSecret={clientSecret} 
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </Elements>
      </div>
    </div>
  );
}
