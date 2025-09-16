import React from "react";
import { FaExclamationTriangle, FaTrash, FaPause } from "react-icons/fa";

export default function ConfirmationModal({ isOpen, onClose, onConfirm, action, loading }) {
  if (!isOpen) return null;

  // Define messages and colors based on action type
  const getActionConfig = () => {
    switch (action) {
      case "disable":
        return {
          title: "Disable Account",
          message: "Are you sure you want to disable your account?",
          description: "Your account will be temporarily disabled. You can reactivate it later.",
          confirmText: "Disable Account",
          confirmButtonClass: "bg-red-600 hover:bg-red-700",
          icon: <FaPause size={50} className="text-red-900" />
        };
      case "delete":
        return {
          title: "Delete Account",
          message: "Are you sure you want to delete your account?",
          description: "This action cannot be undone. All your data will be permanently deleted.",
          confirmText: "Delete Account",
          confirmButtonClass: "bg-red-900 hover:bg-red-900",
          icon: <FaTrash size={50} className="text-red-900" />
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to proceed?",
          description: "",
          confirmText: "Confirm",
          confirmButtonClass: "bg-primary hover:bg-blue-700",
          icon: <FaExclamationTriangle size={50} className="text-white" />
        };
    }
  };

  const config = getActionConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
      {/* Card - Using SavedSearchPopup styling */}
      <div className="relative w-full max-w-[500px] bg-blue text-white rounded-2xl border border-[#DBDFFF] p-8 shadow-xl">
        
        {/* Icon / Image - Using action specific icon
        <div className="flex justify-center mb-6">
          <img
            src="/favicon.ico"
            alt="App Icon"
            className="max-w-[80px] h-auto"
          />
        </div> */}

        {/* Title & Description */}
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="h3 font-bold font-archivo text-g mb-3">
            {config.title}
          </h1>
          <p className="text-lg font-inter mb-2">{config.message}</p>
          {config.description && (
            <p className="text-base font-inter opacity-80">{config.description}</p>
          )}
        </div>

        {/* Action Details - Similar to Payment Details structure */}
        <div className="text-left space-y-3 text-lg font-inter mt-6">
          <div className="flex justify-between">
            <span className="">Action Type</span>
            <span className="opacity-80 capitalize">{action || "Confirm"}</span>
          </div>
          <div className="flex justify-between">
            <span className="">Status</span>
            <span className="opacity-80">Pending Confirmation</span>
          </div>
          {action === "delete" && (
            <div className="flex justify-between">
              <span className="">Reversible</span>
              <span className="opacity-80 text-white">No</span>
            </div>
          )}
        </div>

        {/* Buttons - Using SavedSearchPopup button structure */}
        <div className="mt-10 grid sm:grid-cols-2 justify-center gap-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl border border-white/50 text-white hover:bg-white/20 transition text-center disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl transition text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 ${config.confirmButtonClass}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              config.confirmText
            )}
          </button>
        </div>

        {/* Additional Warning for Delete Action */}
        {action === "delete" && (
          <div className="text-xs font-inter mt-2 w-full text-center leading-tight">
            <b className="text-white"> WARNING:</b> This action is irreversible and will permanently delete all your data.
          </div>
        )}

        {/* Note - Adding general warning */}
        {action !== "delete" && (
          <div className="text-xs font-inter mt-2 w-full text-center leading-tight">
            <b>NOTE:</b> Please confirm your action to proceed.
          </div>
        )}
      </div>
    </div>
  );
}