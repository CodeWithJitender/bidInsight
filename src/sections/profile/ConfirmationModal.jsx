import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

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
          confirmButtonClass: "bg-orange-600 hover:bg-orange-700",
          iconClass: "text-orange-600"
        };
      case "delete":
        return {
          title: "Delete Account",
          message: "Are you sure you want to delete your account?",
          description: "This action cannot be undone. All your data will be permanently deleted.",
          confirmText: "Delete Account",
          confirmButtonClass: "bg-red-600 hover:bg-red-700",
          iconClass: "text-red-600"
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to proceed?",
          description: "",
          confirmText: "Confirm",
          confirmButtonClass: "bg-blue-600 hover:bg-blue-700",
          iconClass: "text-blue-600"
        };
    }
  };

  const config = getActionConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {config.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {/* Warning Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center`}>
              <FaExclamationTriangle className={`w-8 h-8 ${config.iconClass}`} />
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800 mb-2">
              {config.message}
            </p>
            {config.description && (
              <p className="text-sm text-gray-600">
                {config.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-md transition font-medium disabled:opacity-50 ${config.confirmButtonClass}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </span>
            ) : (
              config.confirmText
            )}
          </button>
        </div>

        {/* Additional Warning for Delete Action */}
        {action === "delete" && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm font-medium text-center">
              ⚠️ This action is irreversible
            </p>
          </div>
        )}
      </div>
    </div>
  );
}