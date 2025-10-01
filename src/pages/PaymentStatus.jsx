import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PaymentPopup from "../components/PaymentPopup";
import { paymentSessionDetail } from "../services/pricing.service";

function PaymentStatusInner({ planPrice, status, transactionData }) {
    const [open, setOpen] = useState(false);
    const [paymentResult, setPaymentResult] = useState(status || 'success');
    const [paymentData, setPaymentData] = useState(transactionData);
    
    const profileData = useSelector(state => state.profile?.profile);
    
    // Debug logging
    console.log("PaymentStatusInner Debug:", {
        planPrice,
        status,
        transactionData,
        paymentResult,
        paymentData,
        open
    });

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
        // Check if we have real API data structure
        const isApiData = paymentData?.id && paymentData?.amount_total;
        
        const successData = {
            image: "/payment-successfull.png",
            title: "Your Payment is Successful",
            details: [
                { 
                    label: "Transaction ID", 
                    value: isApiData && paymentData.line_items?.[0]?.id 
                        ? paymentData.line_items[0].id 
                        : (paymentData?.transaction_id || "N/A")
                },
                { 
                    label: "Transaction Date", 
                    value: paymentData?.created_at ? new Date(paymentData.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
                },
                { 
                    label: "Amount", 
                    value: isApiData 
                        ? `$${(paymentData.amount_total / 100).toFixed(2)}` 
                        : (paymentData?.amount ? `$${(paymentData.amount / 100).toFixed(2)}` : `$${planPrice}`)
                },
                {
                    label: "Plan",
                    value: isApiData && paymentData.line_items?.[0]?.product_name 
                        ? paymentData.line_items[0].product_name 
                        : "Subscription Plan"
                },
                {
                    label: "Billing Cycle",
                    value: isApiData && paymentData.line_items?.[0]?.interval 
                        ? paymentData.line_items[0].interval 
                        : "Monthly"
                },
                {
                    label: "Payment Status",
                    value: isApiData ? paymentData.payment_status?.toUpperCase() : "COMPLETED"
                },
                {
                    label: "Customer Email",
                    value: isApiData ? paymentData.customer_email : "N/A"
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
                    value: isApiData && paymentData.line_items?.[0]?.id 
                        ? paymentData.line_items[0].id 
                        : (paymentData?.transaction_id || "N/A")
                },
                { 
                    label: "Attempted Date", 
                    value: paymentData?.created_at ? new Date(paymentData.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
                },
                { 
                    label: "Amount", 
                    value: isApiData 
                        ? `$${(paymentData.amount_total / 100).toFixed(2)}` 
                        : (paymentData?.amount ? `$${(paymentData.amount / 100).toFixed(2)}` : `$${planPrice}`)
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
        console.log("Setting open to true");
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
        
        // Default fallback content to prevent null errors
        return {
            image: "/payment-successfull.png",
            title: "Processing Payment",
            details: [],
            buttons: [{ type: "link", text: "Go to Dashboard", url: "/dashboard" }]
        };
    };

    const popupContent = getPopupContent();
    
    console.log("Render Debug:", {
        open,
        paymentResult,
        popupContent,
        shouldShowPopup: open && paymentResult && popupContent
    });

    return (
        <div className="p-6 max-w-md mx-auto text-center min-h-screen flex flex-col justify-center bg-gray-900">
            {/* Always visible fallback for debugging */}
            <div className="text-white mb-4">
                PaymentStatus Component Loaded - Open: {open.toString()}, Status: {paymentResult}
            </div>
            
            {open && paymentResult && popupContent ? (
                <PaymentPopup
                    content={popupContent}
                    onClose={() => setOpen(false)}
                />
            ) : (
                <div className="text-white bg-blue-600 p-4 rounded">
                    <p>Debug Info:</p>
                    <p>Open: {open.toString()}</p>
                    <p>Payment Result: {paymentResult}</p>
                    <p>Has Content: {popupContent ? 'Yes' : 'No'}</p>
                    {!open && <p>❌ Popup is not open</p>}
                    {!paymentResult && <p>❌ No payment result</p>}
                    {!popupContent && <p>❌ No popup content</p>}
                </div>
            )}
        </div>
    );
}

export default function PaymentStatus() {
    const params = new URLSearchParams(window.location.search);
    const [apiPaymentData, setApiPaymentData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Extract route parameters
    const status =  "success"; // success or failed
    const planPrice = params.get("plan_price") || "29.99";
    const transactionId = params.get("transaction_id");
    const transactionDate = params.get("transaction_date");
    const amount = params.get("amount");
    const sessionId = params.get("status").split("=")[1];
    
    // Debug logging
    console.log("PaymentStatus Debug:", {
        fullURL: window.location.href,
        searchParams: window.location.search,
        status,
        sessionId,
        planPrice,
        allParams: Object.fromEntries(params.entries())
    });
    
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
    const transactionData = apiPaymentData ? {
        // Use real API data
        id: apiPaymentData.id,
        amount_total: apiPaymentData.amount_total,
        currency: apiPaymentData.currency,
        status: apiPaymentData.status,
        payment_status: apiPaymentData.payment_status,
        customer_email: apiPaymentData.customer_email,
        line_items: apiPaymentData.line_items,
        subscription: apiPaymentData.subscription,
        mode: apiPaymentData.mode,
        created_at: new Date().toISOString(), // API doesn't provide created_at, use current date
    } : {
        // Fallback to dummy data
        created_at: transactionDate || new Date().toISOString(),
        amount: amount ? parseFloat(amount) * 100 : parseFloat(planPrice) * 100,
        transaction_id: transactionId || `TXN_${Date.now()}`,
        ...getDummyData(status)
    };

    // Call paymentSessionDetail API when sessionId is available
    useEffect(() => {
        if (sessionId) {
            const fetchPaymentSessionDetails = async () => {
                try {
                    setIsLoading(true);
                    console.log("Fetching payment session details for session ID:", sessionId);
                    const result = await paymentSessionDetail(sessionId);
                    console.log("Payment session details:", result);
                    setApiPaymentData(result);
                } catch (error) {
                    console.error("Error fetching payment session details:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchPaymentSessionDetails();
        } else {
            console.log("No session ID found in URL parameters");
        }
    }, [sessionId]);

    // Show loading while fetching API data
    if (isLoading) {
        return (
            <div className="p-6 max-w-md mx-auto text-center min-h-screen flex flex-col justify-center">
                <div className="text-white">Loading payment details...</div>
            </div>
        );
    }

    return <PaymentStatusInner 
        planPrice={planPrice} 
        status={status}
        transactionData={transactionData}
    />;
}