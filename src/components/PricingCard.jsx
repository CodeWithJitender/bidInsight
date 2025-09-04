import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postPricingPlans } from "../services/admin.service"; // Update path as needed

function PricingCard({ title, price, features, delay, icon, planDetails, isComingSoon }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get plan_id based on title
  const getPlanId = (planTitle) => {
    switch(planTitle) {
      case "Free":
        return 1;
      case "Starter":
        return 2;
      case "Essentials":
        return 3;
      case "A.I. Powerhouse":
        return 4; // For future use
      default:
        return null;
    }
  };

  // Handle plan selection and API call
  const handlePlanSelection = async (planTitle) => {
    if (isComingSoon) return;
    
    const planId = getPlanId(planTitle);
    if (!planId) {
      console.error("Invalid plan title:", planTitle);
      return;
    }

    setIsLoading(true);
    
    try {
      // Call API to set plan
      await postPricingPlans(planId);
      console.log(`✅ Successfully set plan: ${planTitle} (ID: ${planId})`);
      
      // Navigate based on plan type
      switch(planTitle) {
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
      console.error("Failed to set plan:", error);
      // You can show an error message to user here
      alert("Failed to select plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handler function
  const handleNavigation = () => {
    handlePlanSelection(title);
  };

  // Button click handler
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Card click se interfere avoid karna
    handlePlanSelection(title);
  };

  console.log(planDetails, "🔥 Plan details in card");
  
  return (
    <div 
      className={`bg-blue text-white h-[700px] w-full min-w-[320px] mx-auto p-6 rounded-3xl shadow-lg flex flex-col border border-white border-1 relative ${!isComingSoon ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}`} 
      data-aos="fade-up" 
      data-aos-delay={delay}
      onClick={handleNavigation} // Card click handler
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

      <div className="mb-4 w-20 h-20">
        <img src={icon} className="w-full" alt="" />
      </div>
      <h3 className="text-[30px] font-h font-semibold text-start">{title}</h3>
      <div className="flex items-center gap-3">
        <div className="text-[50px] font-bold font-h">${price}</div>
        {/* <div className="">
          <img src="discount.png" className="w-[100%] max-w-[130px]" alt="" />
        </div> */}
      </div>
      
      <button 
        className={`bg-btn border border-white text-white p-4 font-inter font-medium rounded-2xl my-3 ${isComingSoon || isLoading ? 'opacity-50 cursor-not-allowed' : ' hover:text-blue transition-colors'}`} 
        disabled={isComingSoon || isLoading}
        onClick={handleButtonClick} // Button click handler
      >
        {isComingSoon 
          ? "Coming Soon" 
          : isLoading 
            ? "Processing..." 
            : "Upgrade to Plus"
        }
      </button>
      
      <ul className="text-sm text-start flex-1 overflow-y-auto">
        {features && features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xl mb-2">
            <span className="text-white"><i className="far fa-check"></i></span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PricingCard;