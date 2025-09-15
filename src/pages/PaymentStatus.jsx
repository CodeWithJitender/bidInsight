import React, { useEffect, useState } from "react";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux"; // Add this import
import { confirmPlanOrder } from "../services/pricing.service";
import PaymentPopup from "../components/PaymentPopup";

function PaymentStatusInner({ clientSecret, planPrice }) {
    const stripe = useStripe();
    const [status, setStatus] = useState("Checking payment...");
    const POLL_INTERVAL = 1000; // 1 second
    const MAX_DURATION = 30000; // 30 seconds

    const [open, setOpen] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null); // 'success' or 'failed'
    
    // Redux store se profile check karo
    const profileData = useSelector(state => state.profile?.profile);
    
    // Check if profile exists function
   const checkProfileExists = () => {
    if (!profileData) return false;
    
    // Data already object format mein hai
    const profileObject = profileData?.profile;
    
    if (!profileObject || profileObject === null) {
        return false; // Go to onboarding
    }
    
    return true; // Go to dashboard
};

    const processData = [
        {
            image: "/payment-successfull.png",
            title: "Your Payment is Successful",
            details: [
                { label: "Invoice Number", value: "absk-23094-jlaksjd-3993" },
                { label: "Transaction Date", value: "12/09/2025" },
                { label: "Subtotal", value: `$${planPrice}` },
            ],
            buttons: [], // Will be set dynamically based on profile status
        },
        {
            image: "/payment-successfull.png",
            title: "Your Payment was Unsuccessful",
            description:
                "We're sorry, your payment could not be completed due to a gateway error.",
            buttons: [
                { type: "link", text: "Try Again", url: "/" },
            ],
            note: {
                text: "If the issue continues, contact our support team at",
                email: "support@bidinsight.com",
            },
        },
    ];

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
                            setPaymentResult('failed');
                            setOpen(true);
                            return null;
                        default:
                            setStatus("❓ Something went wrong.");
                            setPaymentResult('failed');
                            setOpen(true);
                            return null;
                    }
                } catch (err) {
                    console.error("Error retrieving payment:", err);
                    setStatus("❌ Error checking payment status.");
                    setPaymentResult('failed');
                    setOpen(true);
                    return null;
                }

                await sleep(POLL_INTERVAL);
            }

            if (isMounted && paymentIntent?.status !== "succeeded") {
                setStatus("❌ Payment did not succeed within 30 seconds.");
                setPaymentResult('failed');
                setOpen(true);
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
                        setPaymentResult('success');
                        setOpen(true);
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
                setPaymentResult('failed');
                setOpen(true);
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

    // Get the appropriate content based on payment result
    const getPopupContent = () => {
        if (paymentResult === 'success') {
            const hasProfile = checkProfileExists();
            
            // Dynamic button based on profile status
            const successButtons = hasProfile 
                ? [{ type: "link", text: "Go to Dashboard", url: "/dashboard" }]
                : [{ type: "link", text: "Complete your onboarding", url: "/geographic-coverage" }];
            
            return {
                ...processData[0],
                buttons: successButtons
            };
        } else if (paymentResult === 'failed') {
            return processData[1]; // Failed payment content
        }
        return null;
    };

    return (
        <div className="p-6 max-w-md mx-auto text-center min-h-screen flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Payment Status</h2>
            <p className="text-lg">{status}</p>
            {open && paymentResult && (
                <PaymentPopup 
                    content={getPopupContent()} 
                    onClose={() => setOpen(false)} 
                />
            )}
        </div>
    );
}

export default function PaymentStatus() {
    const params = new URLSearchParams(window.location.search);
    const publishableKey = params.get("publishableKey");
    const clientSecret = params.get("payment_intent_client_secret");
    const planPrice = params.get("plan_price");

    if (!publishableKey || !clientSecret) return <p>❌ Missing required Stripe parameters</p>;

    const stripePromise = loadStripe(publishableKey);

    return (
        <Elements stripe={stripePromise}>
            <PaymentStatusInner clientSecret={clientSecret} planPrice={planPrice} />
        </Elements>
    );
}