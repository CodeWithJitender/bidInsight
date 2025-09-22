import React from "react";
import { Crown, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { data } from "jquery";

const SavedSearchPopup = ({
  isOpen,
  onClose,
  onCloseFilterPanel,
  title = "Saved Search Limit Reached",
  message = "You've reached your saved search limit for the Starter plan. Upgrade to create unlimited saved searches.",
  upgradeButtonText = "Upgrade Plan",
  cancelButtonText = "Cancel",
  showBackToDashboard = false,
  onBackToDashboard,
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (showBackToDashboard && onBackToDashboard) {
      onBackToDashboard(); // Navigate to dashboard
    } else {
      onClose(); // Normal close
    }
  };

  // Button text decide karo
  const cancelText = showBackToDashboard ? "Back to Dashboard" : cancelButtonText;

  const dataPlan = useSelector((state) => state.profile?.profile?.subscription_plan.name); // To re-render on profile change
  console.log(dataPlan, "🔥 Profile Data in SavedSearchPopuppppppppppppppppppppp");

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate("/pricing");
    onClose();

    if (onCloseFilterPanel) {
      onCloseFilterPanel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
      {/* Card - Using PaymentPopup styling */}
      <div className="relative w-full max-w-[500px] bg-blue text-white rounded-2xl border border-[#DBDFFF] p-8 shadow-xl">
        
        {/* Icon / Image - Using AlertTriangle from original */}
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

        {/* Access Details - Similar to Payment Details structure */}
        <div className="text-left space-y-3 text-lg font-inter mt-6">
          <div className="flex justify-between">
            <span className="">Plan Type</span>
            <span className="opacity-80">{dataPlan} Plan</span>
          </div>
          <div className="flex justify-between">
            <span className="">Current Status</span>
            <span className="opacity-80">Limit Reached</span>
          </div>
          {/* <div className="flex justify-between">
            <span className="font-semibold">Feature</span>
            <span className="opacity-80">Saved Searches</span>
          </div> */}
        </div>

        {/* Buttons - Using PaymentPopup button structure */}
        <div className="mt-10 grid sm:grid-cols-2 justify-center gap-6">
          <button
            onClick={handleCancel}
            className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl border border-white/50 text-white hover:bg-white/20 transition text-center"
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleUpgrade}
            className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center gap-2"
          >
            <Crown size={20} />
            {upgradeButtonText}
          </button>
        </div>

        {/* Note - Adding upgrade benefits */}
        <div className="text-xs font-inter mt-2 w-full text-center leading-tight">
          <b>NOTE:</b> Upgrade to unlock unlimited bid summary, saved searches and premium features.
        </div>
      </div>
    </div>
  );
};

export default SavedSearchPopup;