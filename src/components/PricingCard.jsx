import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { postPricingPlans } from "../services/admin.service"; // Update path

function PricingCard({ title, price, features, delay, icon, isComingSoon, planID }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Get subscription plan id from Redux (if logged in)
  const subscriptionPlanId = useSelector(
    (state) => state.profile?.profile?.subscription_plan?.plan_code || null
  );

  const numericSubPlanId = subscriptionPlanId ? parseInt(subscriptionPlanId, 10) : null;
  const numericPlanId = parseInt(planID, 10);

  // Button state logic
  let buttonText = "Upgrade";
  let isButtonDisabled = false;
  let shouldRenderButton = true;

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

  // Handle plan selection
  const handlePlanSelection = async () => {
    if (isComingSoon || isButtonDisabled) return;

    // Guest user clicks
    if (!numericSubPlanId) {
      navigate("/signup"); // redirect guest to signup page
      return;
    }

    setIsLoading(true);
    try {
      await postPricingPlans(numericPlanId);
      console.log(`✅ Successfully set plan: ${title} (ID: ${numericPlanId})`);

      // Navigate based on plan type
      switch (title) {
        case "Free":
          navigate("/dashboard?page=1&pageSize=25&bid_type=Active&ordering=closing_date");
          break;
        case "Starter":
        case "Essentials":
          navigate("/geographic-coverage");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("❌ Failed to set plan:", error);
      alert("Failed to select plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-blue text-white h-[700px] w-full min-w-[320px] mx-auto p-6 rounded-3xl shadow-lg flex flex-col border border-white border-1 relative ${
        !isComingSoon ? "cursor-pointer hover:shadow-xl transition-shadow" : ""
      }`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-80 rounded-3xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-lg text-gray-200">Stay tuned for updates!</p>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4 w-20 h-20">
        <img src={icon} className="w-full" alt={title} />
      </div>

      {/* Title + Price */}
      <h3 className="text-[30px] font-h font-semibold text-start">{title}</h3>
      <div className="flex items-center gap-3">
        <div className="text-[50px] font-bold font-h">
          {price === "0" ? "Free" : `$${price}`}
        </div>
      </div>

      {/* Action Button */}
      {shouldRenderButton && (
        <button
          className={`bg-btn border border-white text-white p-4 font-inter font-medium rounded-2xl my-3 ${
            isComingSoon || isLoading || isButtonDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-blue transition-colors"
          }`}
          disabled={isComingSoon || isLoading || isButtonDisabled}
          onClick={handlePlanSelection}
        >
          {isComingSoon
            ? "Coming Soon"
            : isLoading
            ? "Processing..."
            : buttonText}
        </button>
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
