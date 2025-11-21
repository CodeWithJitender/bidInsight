import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckOutSession } from "../services/pricing.service";

function PricingCard({
  title,
  price,
  features,
  delay,
  icon,
  isComingSoon,
  planID,
  duration,
  isDisabled,
  disabledMessage
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false); // ✅ Add t

  // Get subscription plan id from Redux (if logged in)
  const subscriptionPlanId = useSelector(
    (state) => state.profile?.profile?.subscription_plan?.plan_code || null
  );

  const numericSubPlanId = subscriptionPlanId
    ? parseInt(subscriptionPlanId, 10)
    : null;
  const numericPlanId = parseInt(planID, 10);

  // Button state logic
  let buttonText = "Upgrade";
  let isButtonDisabled = false;
  let shouldRenderButton = true;
  let tooltipMessage = "";

  if (!numericSubPlanId) {
    // 👉 Guest user
    if (title === "Free") {
      buttonText = "Try Now";
    } else {
      buttonText = "Buy Now";
    }
  } else {
    // 👉 Logged in user
    if (numericPlanId < numericSubPlanId) {
      shouldRenderButton = false; // remove button
    } else if (numericPlanId === numericSubPlanId) {
      buttonText = "Selected";
      isButtonDisabled = true;
    }
  }


  // ✅ ADD THIS INSTEAD:
  // ✅ Dynamic button text based on disabled state
  if (isDisabled) {
    // Extract which tab to switch to from the disabled message
    if (disabledMessage && disabledMessage.includes("'Monthly'")) {
      buttonText = "Switch to Monthly";
    } else if (disabledMessage && disabledMessage.includes("'Annual'")) {
      buttonText = "Switch to Annual";
    } else {
      buttonText = "Not Available";
    }
    tooltipMessage = disabledMessage || "Unable to upgrade at this time.";
  }


  // Handle plan selection
  const handlePlanSelection = async (e) => {
    if (isComingSoon || isButtonDisabled) return;

    const isFreeplan = price === "0" || title === "Free";

    if (isFreeplan) {
      e.preventDefault();
    }

    // ✅ FREE PLAN LOGIC - Direct navigation, no scrolling
    if (price === "0" || title === "Free") {
      // Check if user is logged in
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        // User logged in → go to dashboard
        navigate("/dashboard");
      } else {
        // User not logged in → go to login
        navigate("/login");
      }
      return; // Exit function, no payment flow
    }

    // 🔹 NEW LOGIC: For Starter & Essentials - redirect logout users to /login
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken && (title === "Starter" || title === "Essentials")) {
      navigate("/login");
      return;
    }

    // 🔹 PAID PLANS LOGIC - Scroll to pricing section (for logged in users only)
    const pricingElement = document.getElementById("pricing-cards");
    pricingElement.scrollIntoView({
      behavior: "smooth",
      block: "center", // center me le jayega instead of top
    });

    if (!accessToken) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      console.log(duration, "Selected billing cycle");

      const res = await CheckOutSession(numericPlanId, duration);
      console.log(res);

      if (res && res.url) {
        // Redirect to the checkout URL
        window.location.href = res.url;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("❌ Failed to initiate payment:", error);
      alert(error?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-blue text-white h-full  w-full  mx-auto p-6 rounded-3xl shadow-lg flex flex-col border border-white border-1 relative ${!isComingSoon ? "cursor-pointer hover:shadow-xl transition-shadow" : ""
        }`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-80 rounded-3xl">
          <div className="text-center">
            <h2 className="lg:text-3xl   xl:text-4xl font-bold text-white mb-2">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-200">Stay tuned for updates!</p>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4 w-20 h-20">
        <img src={icon} className="w-full" alt={title} />
      </div>

      {/* Title + Price Section */}
      <h3 className="text-[30px] font-h font-semibold text-start">{title}</h3>
      <div className="flex flex-col space-y-0.5"> {/* Reduced space from space-y-1 to space-y-0.5 */}
        {/* Price Display */}
        <div className="flex items-baseline mt-5 gap-2">
          <span className="text-[50px] font-bold font-h leading-[1] tracking-tight">
            {price === "0" ? "Free" : `$${price}`}
          </span>
          <span className="text-[20px] font-medium text-white/90">
            {duration === "year" ? "/year" : "/mo"}
          </span>
        </div>

        {/* Tax Note - Left aligned with reduced top gap */}
        <div
          className="text-[13px] font-normal text-white/60 tracking-wide text-left pl-1"
          title="Taxes will be calculated based on your billing location"
        >
          Plus applicable taxes
        </div>
      </div>

      {/* Action Button */}
      {/* // Replace button with: */}
      {shouldRenderButton && (
        <div className="relative"> {/* ✅ Wrap in div for tooltip positioning */}
          <button
            className={`bg-btn border border-white text-white p-4 font-inter w-full font-medium rounded-2xl my-3 ${isComingSoon || isLoading || isButtonDisabled || isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-blue transition-colors"
              }`}
            disabled={isComingSoon || isLoading || isButtonDisabled || isDisabled}
            onClick={handlePlanSelection}
            // ✅ FIXED (Check both conditions):
            onMouseEnter={() => (isDisabled || isButtonDisabled) && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)} // ✅ Add this
          >
            {isComingSoon
              ? "Coming Soon"
              : isLoading
                ? "Processing..."
                : buttonText}
          </button>

          {/* ✅ Tooltip Popup */}
          {(isDisabled || isButtonDisabled) && showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 z-50">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm rounded-lg p-4 shadow-2xl border border-blue-400/30 relative">
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-8 border-transparent border-t-blue-800"></div>
                </div>

                {/* Icon */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* Message */}
                // ✅ UPDATED:
                  <div className="flex-1">
                    <p className="font-semibold mb-1">⚠️ Upgrade Restricted</p>
                    <p className="text-xs leading-relaxed opacity-90">
                      {tooltipMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      <ul className="text-sm text-start flex-1 overflow-y-auto">
        {features?.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xl mb-2">
            <span className="text-white">
              <i className="far fa-check"></i>
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PricingCard;
