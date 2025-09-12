import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Add this import
import {
  FaUniversity,
  FaRedo,
  FaEnvelope,
  FaBan,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import CustomTooltip from "../../components/CustomTooltip";
import { forgotPasswordRequest, emailAlert, deactivateAccount } from "../../services/user.service";
import ChangePasswordModal from "./ChangePasswordModal";
import ConfirmationModal from "./ConfirmationModal";

export default function AccountSetting({ fullName, lastLogin }) {
  console.log(lastLogin);
  
  const navigate = useNavigate(); // Add this
  
  // States for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for confirmation popup
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(""); // Add this state
  
  // States for password change enhancement
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordCooldown, setPasswordCooldown] = useState(0);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(false);

  // States for email alert dropdown
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailAlertLoading, setEmailAlertLoading] = useState(false);
  const [currentEmailAlert, setCurrentEmailAlert] = useState("");

  // Get email from Redux store
  const reduxProfileData = useSelector((state) => { 
    return state.profile.profile ? state.profile.profile.email : '';
  });

  console.log(reduxProfileData, "🔥 Profile Data from Redux");
  const userEmail = reduxProfileData || '';

  // Cooldown timer effects
  useEffect(() => {
    let interval;
    if (passwordCooldown > 0) {
      interval = setInterval(() => {
        setPasswordCooldown(prev => {
          if (prev <= 1) {
            setIsPasswordDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [passwordCooldown]);

  const settings = [
    {
      title: "Payment Mode",
      description: "Change your payment method",
      tooltip: "This link will take you to an external page to update your payment method.",
      icon: <FaUniversity className="text-primary text-xl" />,
      action: "payment"
    },
    {
      title: "Change Password",
      description: "Change your password",
      tooltip: "Use a strong password with at least 8 characters with one capital letter, one number & one special character.",
      icon: <FaRedo className={`text-primary text-xl ${isPasswordLoading ? 'animate-spin' : ''}`} />,
      action: "password"
    },
    {
      title: "Email Alerts",
      description: "Change the frequency of your email alerts",
      tooltip: "You can change the frequency of your bid updates over email here.",
      icon: <FaEnvelope className="text-primary text-xl" />,
      action: "email"
    },
    {
      title: "Account Disable",
      description: "Disable your account",
      tooltip: "This will disable your account temporarily.",
      icon: <FaBan className="text-primary text-xl" />,
      action: "disable"
    },
    {
      title: "Account Deletion",
      description: "Delete your account",
      tooltip: "This will permanently delete your account and all associated data.",
      icon: <FaTrash className="text-red-600 text-xl" />,
      action: "delete"
    },
  ];

  // Email alert options
  const emailAlertOptions = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Disabled", value: "disabled" }
  ];

  // Updated handleConfirmAction function
  const handleConfirmAction = async () => {
    try {
      setConfirmLoading(true);
      setConfirmError(""); // Clear any previous errors
      
      await deactivateAccount();
      
      console.log(`Account ${confirmAction} successful`);
      
      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Close popup
      setShowConfirmPopup(false);
      setConfirmAction("");
      
      // Redirect to login page
      navigate('/login');
      
    } catch (error) {
      console.error(`Error ${confirmAction}ing account:`, error);
      
      // Set error message to display in popup
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setConfirmError(errorMessage);
      
    } finally {
      setConfirmLoading(false);
    }
  };

  // Handle email alert selection
  const handleEmailAlertSelect = async (option) => {
    try {
      setEmailAlertLoading(true);
      setShowEmailDropdown(false);
      
      const payload = {
        email_alerts: option.value
      };
      
      console.log("Email Alert Payload:", payload);
      console.log("Selected Option:", option);
      console.log("API Call Started for:", option.label);
      
      await emailAlert(payload);
      
      setCurrentEmailAlert(option.label);
      
      console.log("Email Alert Successfully Set to:", option.label);
      
    } catch (error) {
      console.error("Error setting email alert:", error);
      console.log("API Error Details:", error.response?.data || error.message);
    } finally {
      setEmailAlertLoading(false);
      console.log("Email Alert Loading State Reset");
    }
  };

  // Handle setting click
  const handleSettingClick = async (action) => {
    if (action === "password") {
      if (isPasswordDisabled) {
        return;
      }

      if (!userEmail) {
        return;
      }
      
      try {
        setIsPasswordLoading(true);
        setIsPasswordDisabled(true);
        
        await forgotPasswordRequest(userEmail);
        
        setIsPasswordLoading(false);
        setIsModalOpen(true);
        setPasswordCooldown(40);
        
      } catch (error) {
        console.error("Error sending OTP:", error);
        
        setIsPasswordLoading(false);
        setIsPasswordDisabled(false);
        setPasswordCooldown(0);
      }
    } else if (action === "email") {
      setShowEmailDropdown(!showEmailDropdown);
    } else if (action === "disable" || action === "delete") {
      setConfirmAction(action);
      setConfirmError(""); // Clear any previous errors
      setShowConfirmPopup(true);
    }
  };

  return (
    <div className="p-4 xl:p-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white mb-8">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-gray-500 font-medium font-inter">Hello</p>
            <p className="text-2xl font-medium text-black font-inter">{fullName}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-[#999999] font-inter font-medium">Signup On</p>
          <p className="text-lg font-medium text-black">{lastLogin}</p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold font-inter text-gray-800 mb-6">
        User Account Settings
      </h2>

      {/* Settings List */}
      <div className="space-y-4">
        {settings.map((item, i) => (
          <div className="max-w-2xl relative" key={i}>
            <div className="flex items-center gap-2 mb-3 w-full justify-between">
              <p className="text-sm font-medium text-gray-500 font-inter">{item.title}</p>
              <CustomTooltip title={item.tooltip} />
            </div>
            <div
              onClick={() => handleSettingClick(item.action)}
              className={`flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm transition ${
                item.action === "password" && isPasswordDisabled 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'hover:shadow-md cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <p className="text-base font-medium text-black">{item.description}</p>
                {item.action === "email" && currentEmailAlert && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Current: {currentEmailAlert}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {item.action === "email" && emailAlertLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                )}
                {item.action === "email" ? (
                  showEmailDropdown ? <FaChevronUp className="text-primary text-lg" /> : <FaChevronDown className="text-primary text-lg" />
                ) : (
                  item.icon
                )}
              </div>
            </div>

            {/* Password Cooldown Timer */}
            {item.action === "password" && passwordCooldown > 0 && (
              <div className="mt-2 text-center">
                <p className="text-sm text-blue-600 font-medium">
                  Please wait {passwordCooldown} seconds before trying again
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${((40 - passwordCooldown) / 40) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Email Alert Dropdown */}
            {item.action === "email" && showEmailDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {emailAlertOptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleEmailAlertSelect(option)}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition flex items-center justify-between ${
                      index !== emailAlertOptions.length - 1 ? 'border-b border-gray-100' : ''
                    } ${currentEmailAlert === option.label ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                    {currentEmailAlert === option.label && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Change Password Modal Component */}
      <ChangePasswordModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userEmail={userEmail}
      />

      {/* Confirmation Modal Component with error support */}
      <ConfirmationModal 
        isOpen={showConfirmPopup}
        onClose={() => {
          setShowConfirmPopup(false);
          setConfirmAction("");
          setConfirmError(""); // Clear error when closing
        }}
        onConfirm={handleConfirmAction}
        action={confirmAction}
        loading={confirmLoading}
        error={confirmError} // Pass error to modal
      />

      {/* Backdrop to close dropdown when clicked outside */}
      {showEmailDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowEmailDropdown(false)}
        />
      )}
    </div>
  );
}