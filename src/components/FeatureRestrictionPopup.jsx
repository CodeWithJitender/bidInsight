import React from 'react';
import { Crown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FeatureRestrictionPopup = ({
  isOpen,
  onClose,
  onUpgrade,
  title = "Feature Restricted",
  message = "This feature is not available in your current plan.",
  featureName = "Premium Feature",
  showUpgradeButton = true
}) => {
  const navigate = useNavigate();

   const dataPlan = useSelector((state) => state.profile?.profile?.subscription_plan); // To re-render on profile change
  console.log(dataPlan, "🔥 Profile Data in SavedSearchPopup");

  // Plan mapping
  const planTypeMap = {
    "001": "Sneak Plan",
    "002": "Starter Plan",
    "003": "Essential Plan",
    // "004": "Enterprise Plan",
  };

  // Resolve current plan
  const currentPlan =
    planTypeMap[dataPlan?.plan_code] || "Unknown Plan";



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
      {/* Card - Using SavedSearchPopup styling */}
      <div className="relative w-full max-w-[500px] bg-blue text-white rounded-2xl border border-[#DBDFFF] p-8 shadow-xl">
        
        {/* Icon / Image - Using AlertTriangle */}
        <div className="flex justify-center mb-6">
          <div className="w-[80px] h-[80px] bg-white/10 rounded-full flex items-center justify-center">
            <img src="/popuplogo.png" alt="" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="h3 font-bold font-archivo text-g mb-3">
            {title}
          </h1>
          <p className="text-lg font-inter">{message}</p>
        </div>

        {/* Feature Details - Similar to Payment Details structure */}
        <div className="text-left space-y-3 text-lg font-inter mt-6">
          <div className="flex justify-between">
            <span className="">Plan Type</span>
            <span className="opacity-80">{currentPlan}</span>
          </div>
          <div className="flex justify-between">
            <span className="">Current Status</span>
            <span className="opacity-80">Restricted</span>
          </div>
         
        </div>

        {/* Buttons - Using SavedSearchPopup button structure */}
        <div className="mt-10 grid sm:grid-cols-2 justify-center gap-6">
          <button
            onClick={onClose}
            className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl border border-white/50 text-white hover:bg-white/20 transition text-center"
          >
            Close
          </button>
          
          {showUpgradeButton && (
            <button
              onClick={onUpgrade}
              className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center gap-2"
            >
              <Crown size={20} />
              Upgrade Plan
            </button>
          )}
        </div>

        {/* Additional Buy Plan Button */}
       

        {/* Note - Adding feature benefits */}
        <div className="text-xs font-inter mt-2 w-full text-center leading-tight">
          <b>NOTE:</b> Upgrade your plan to unlock this feature and many more premium benefits.
        </div>
      </div>
    </div>
  );
};

export default FeatureRestrictionPopup;