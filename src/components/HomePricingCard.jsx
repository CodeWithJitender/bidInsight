// components/HomePricingCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function HomePricingCard({ title, price, features, delay, icon, isComingSoon, planID }) {
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return token && token !== null;
  };

  // Handle card button click
  const handleCardClick = () => {
    if (isComingSoon) return;
    
    if (isAuthenticated()) {
      navigate('/pricing');
    } else {
      navigate('/login');
    }
  };

  // Button text logic
  const getButtonText = () => {
    if (isComingSoon) return "Coming Soon";
    if (price === "0" || title === "Free") return "Try Now";
    return "Buy Now";
  };

  return (
    <div
      className={`bg-blue text-white md:h-[850px] w-full mx-auto p-6 rounded-3xl shadow-lg flex flex-col border border-white border-1 relative ${
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
      <button
        className={`bg-btn border border-white text-white p-4 font-inter w-[14rem] font-medium rounded-2xl my-3 ${
          isComingSoon
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-blue transition-colors"
        }`}
        disabled={isComingSoon}
        onClick={handleCardClick}
      >
        {getButtonText()}
      </button>

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

export default HomePricingCard;