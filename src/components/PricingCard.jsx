  import React, { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { useSelector } from "react-redux";
  import { initiatePlanOrder } from "../services/pricing.service";

  function PricingCard({ title, price, features, delay, icon, isComingSoon, planID, duration }) {
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

    // 🔹 PAID PLANS LOGIC - Scroll to pricing section
    const pricingElement = document.getElementById('pricing-cards');
    pricingElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' // center me le jayega instead of top
    });

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      console.log(duration, "Selected billing cycle");

      const res = await initiatePlanOrder(numericPlanId, price, duration);

      if (!res?.clientSecret || !res?.publishableKey) {
        throw new Error("Invalid response from payment API");
      }

      console.log("💳 Payment details:", res);

      navigate("/payment", {
        state: {
          clientSecret: res.clientSecret,
          publishableKey: res.publishableKey,
          plan: res.plan,
        },
      });
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
              <h2 className="lg:text-3xl   xl:text-4xl font-bold text-white mb-2">Coming Soon</h2>
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
      {/* // Replace button with: */}
      {shouldRenderButton && (
    <Link to="#pricing-cards">
      <button
        className={`bg-btn border border-white text-white p-4 font-inter w-full font-medium rounded-2xl my-3 ${isComingSoon || isLoading || isButtonDisabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:text-blue transition-colors"
          }`}
        disabled={isComingSoon || isLoading || isButtonDisabled}
        onClick={handlePlanSelection}
      >
        {isComingSoon ? "Coming Soon" : isLoading ? "Processing..." : buttonText}
      </button>
    </Link>
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
