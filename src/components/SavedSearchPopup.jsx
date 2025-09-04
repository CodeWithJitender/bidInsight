import React from "react";
import { X, Crown, AlertTriangle } from "lucide-react";
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div className="bg-gradient-to-br from-[#20232f] via-[#283593] to-[#4a5ba8] rounded-xl shadow-lg max-w-xs w-full mx-2 overflow-hidden border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
        
        {/* Header */}
        <div className="px-4 py-3 relative flex items-center border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/10 rounded-lg flex items-center justify-center">
              <AlertTriangle size={18} className="text-yellow-300" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">{title}</h2>
              <p className="text-indigo-100 text-xs">Saved Searches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white focus:outline-none transition"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-white/5 rounded-b-xl">
          <div className="text-center mb-4">
            <div className="w-10 h-10 bg-indigo-100/70 rounded-full flex items-center justify-center mx-auto mb-2 border border-indigo-300/20">
              <Crown className="text-indigo-600" size={18} />
            </div>
            <h3 className="font-semibold text-white text-sm mb-2">
              Access Restricted
            </h3>
            <div className="bg-white/10 rounded-lg p-2 mb-2 border border-white/10">
              <p className="text-indigo-100 text-xs">{message}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 border border-white/10 text-white rounded-lg hover:bg-white/10 transition font-medium text-xs"
            >
              {cancelButtonText}
            </button>

            <button
              onClick={handleUpgrade}
              className="px-3 py-2 bg-gradient-to-r from-sky-600 via-indigo-800 to-indigo-600 text-white rounded-lg hover:opacity-90 transition font-medium text-xs flex items-center justify-center gap-1"
            >
              <Crown size={13} />
              {upgradeButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedSearchPopup;
