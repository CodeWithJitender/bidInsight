import React, { useState } from "react";
import { useSelector } from "react-redux";
import PaymentPopup from "../components/PaymentPopup";

function PaymentStatusInner({ planPrice, status, transactionData }) {
    const [open, setOpen] = useState(false);
    const [paymentResult, setPaymentResult] = useState(status || 'success');
    const [paymentData, setPaymentData] = useState(transactionData);
    
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


    // Generate dynamic process data based on payment data
    const getProcessData = () => {
        const successData = {
            image: "/payment-successfull.png",
            title: "Your Payment is Successful",
            details: [
                { 
                    label: "Transaction ID", 
                    value: paymentData?.transaction_id || "N/A"
                },
                { 
                    label: "Transaction Date", 
                    value: paymentData?.created_at ? new Date(paymentData.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
                },
                { 
                    label: "Amount", 
                    value: paymentData?.amount ? `$${(paymentData.amount / 100).toFixed(2)}` : `$${planPrice}`
                },
                {
                    label: "Payment Method",
                    value: paymentData?.payment_method ? paymentData.payment_method.toUpperCase() : "CARD"
                },
                {
                    label: "Status",
                    value: "COMPLETED"
                }
            ],
            buttons: [], // Will be set dynamically based on profile status
        };

        const failedData = {
            image: "/payment-ussuccessfull.png",
            title: "Your Payment was Unsuccessful",
            description: paymentData?.error_message || "We're sorry, your payment could not be completed due to a gateway error.",
            details: [
                { 
                    label: "Transaction ID", 
                    value: paymentData?.transaction_id || "N/A"
                },
                { 
                    label: "Attempted Date", 
                    value: paymentData?.created_at ? new Date(paymentData.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
                },
                { 
                    label: "Amount", 
                    value: paymentData?.amount ? `$${(paymentData.amount / 100).toFixed(2)}` : `$${planPrice}`
                },
                {
                    label: "Error Code",
                    value: paymentData?.error_code || "PAYMENT_FAILED"
                },
                {
                    label: "Status",
                    value: "FAILED"
                }
            ],
            buttons: [
                { type: "link", text: "Try Again", url: "/" },
            ],
            note: {
                text: "If the issue continues, contact our support team at",
                email: "support@bidinsight.com",
            },
        };

        return [successData, failedData];
    };

    // Show payment popup on component mount
    React.useEffect(() => {
        setOpen(true);
    }, []);

    // Get the appropriate content based on payment result
    const getPopupContent = () => {
        const processData = getProcessData();
        
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
    
    // Extract route parameters
    const status = params.get("status") || "success"; // success or failed
    const planPrice = params.get("plan_price") || "29.99";
    const transactionId = params.get("transaction_id");
    const transactionDate = params.get("transaction_date");
    const amount = params.get("amount");
    
    // Create dummy data structure
    const getDummyData = (paymentStatus) => {
        const baseData = {
            created_at: transactionDate || new Date().toISOString(),
            amount: amount ? parseFloat(amount) * 100 : parseFloat(planPrice) * 100,
            transaction_id: transactionId || `TXN_${Date.now()}`,
        };
        
        if (paymentStatus === 'success') {
            return {
                ...baseData,
                status: "succeeded",
                payment_method: "card",
                currency: "usd"
            };
        } else {
            return {
                ...baseData,
                status: "failed",
                error_code: "card_declined",
                error_message: "Your card was declined."
            };
        }
    };
    
    // Use dynamic data or fallback to dummy data
    const transactionData = {
        created_at: transactionDate || new Date().toISOString(),
        amount: amount ? parseFloat(amount) * 100 : parseFloat(planPrice) * 100,
        transaction_id: transactionId || `TXN_${Date.now()}`,
        ...getDummyData(status)
    };

    return <PaymentStatusInner 
        planPrice={planPrice} 
        status={status}
        transactionData={transactionData}
    />;
}