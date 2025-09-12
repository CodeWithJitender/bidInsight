import React, { useEffect, useState } from "react";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { confirmPlanOrder } from "../services/pricing.service";

function PaymentStatusInner({ clientSecret }) {
    const stripe = useStripe();
    const [status, setStatus] = useState("Checking payment...");
    const POLL_INTERVAL = 1000; // 1 second
    const MAX_DURATION = 30000; // 30 seconds

    useEffect(() => {
        if (!stripe || !clientSecret) return;

        let isMounted = true;

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // Poll Stripe until payment succeeds or timeout
        const pollStripePayment = async () => {
            const startTime = Date.now();
            let paymentIntent;

            while (Date.now() - startTime < MAX_DURATION && isMounted) {
                try {
                    const res = await stripe.retrievePaymentIntent(clientSecret);
                    paymentIntent = res.paymentIntent;

                    if (!paymentIntent) {
                        setStatus("❌ Unable to retrieve payment info.");
                        return;
                    }

                    switch (paymentIntent.status) {
                        case "succeeded":
                            setStatus("💳 Payment succeeded! Activating plan...");
                            return paymentIntent.id; // exit loop and start backend polling
                        case "processing":
                            setStatus("⏳ Payment is processing...");
                            break;
                        case "requires_payment_method":
                            setStatus("❌ Payment failed, please try again.");
                            return null;
                        default:
                            setStatus("❓ Something went wrong.");
                            return null;
                    }
                } catch (err) {
                    console.error("Error retrieving payment:", err);
                    setStatus("❌ Error checking payment status.");
                    return null;
                }

                await sleep(POLL_INTERVAL);
            }

            if (isMounted && paymentIntent?.status !== "succeeded") {
                setStatus("❌ Payment did not succeed within 30 seconds.");
                return null;
            }
        };

        // Poll backend to confirm plan activation
        const pollPlanActivation = async (paymentIntentId) => {
            const startTime = Date.now();

            while (Date.now() - startTime < MAX_DURATION && isMounted) {
                try {
                    const res = await confirmPlanOrder(paymentIntentId);
                    console.log(res, "Plan activation response");

                    if (res.status === "succeeded") {
                        setStatus("✅ Payment succeeded and plan activated!");
                        return;
                    } else {
                        setStatus("⏳ Payment succeeded, activating plan...");
                    }
                } catch (err) {
                    console.error("Error confirming plan:", err);
                }

                await sleep(POLL_INTERVAL);
            }

            if (isMounted) {
                setStatus("❌ Payment succeeded but plan activation failed. Contact support.");
            }
        };

        const runFlow = async () => {
            const paymentIntentId = await pollStripePayment();
            if (paymentIntentId) {
                await pollPlanActivation(paymentIntentId);
            }
        };

        runFlow();

        return () => {
            isMounted = false;
        };
    }, [stripe, clientSecret]);

    return (
        <div className="p-6 max-w-md mx-auto text-center min-h-screen flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Payment Status</h2>
            <p className="text-lg">{status}</p>
        </div>
    );
}

export default function PaymentStatus() {
    const params = new URLSearchParams(window.location.search);
    const publishableKey = params.get("publishableKey");
    const clientSecret = params.get("payment_intent_client_secret");

    if (!publishableKey || !clientSecret) return <p>❌ Missing required Stripe parameters</p>;

    const stripePromise = loadStripe(publishableKey);

    return (
        <Elements stripe={stripePromise}>
            <PaymentStatusInner clientSecret={clientSecret} />
        </Elements>
    );
}
