import React from "react";
import { X, Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedSearchPopup = ({
  isOpen,
  onClose,
  title = "Saved Search Limit Reached",
  message = "You've reached your saved search limit for the Starter plan. Upgrade to create unlimited saved searches.",
  upgradeButtonText = "Upgrade Plan",
  cancelButtonText = "Cancel",
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate("/pricing");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
        {/* Header */}
        <div className="px-6 py-4 relative bg-gradient-to-r from-[#192070] via-[#2736C0] to-[#424EC5]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">{title}</h2>
              <p className="text-white/90 text-sm">Saved Searches</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="text-indigo-600" size={26} />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-3">
              Access Restricted
            </h3>

            {/* Message */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              {cancelButtonText}
            </button>

            <button
              onClick={handleUpgrade}
              className="px-4 py-2.5 bg-gradient-to-r from-[#192070] via-[#2736C0] to-[#424EC5] text-white rounded-lg hover:opacity-90 transition-all font-medium text-sm flex items-center justify-center gap-2"
            >
              <Crown size={16} />
              {upgradeButtonText}
            </button>
          </div>

          {/* Additional info */}
          {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2">
              With Premium Plans:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Unlimited saved searches</li>
              <li>• Advanced filtering options</li>
              <li>• Priority customer support</li>
              <li>• Enhanced bid matching</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SavedSearchPopup;
