


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import {
  forgotPasswordRequest,
  emailAlert,
  EmailAlertUpdate,
  getApiEmailAlert,
  deactivateAccount
} from "../../services/user.service";
import ChangePasswordModal from "./ChangePasswordModal";
import ConfirmationModal from "./ConfirmationModal";
import { clearProfile } from "../../redux/reducer/profileSlice";
import { logoutUser } from "../../redux/reducer/authSlice";
import { clearLoginData } from "../../redux/reducer/loginSlice";
import { clearOnboardingData } from "../../redux/reducer/onboardingSlice";
import { clearSavedSearches } from "../../redux/reducer/savedSearchesSlice";
import { persistor } from "../../redux/store";

export default function AccountSetting({ fullName, lastLogin }) {
  console.log(lastLogin);

  const navigate = useNavigate();

  // States for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for confirmation popup
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  // States for password change enhancement
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordCooldown, setPasswordCooldown] = useState(0);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(false);

  // States for email alert dropdown
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailAlertLoading, setEmailAlertLoading] = useState(false);
  const [currentEmailAlert, setCurrentEmailAlert] = useState("");

  // NEW: States for existing email alert settings
  const [existingEmailSettings, setExistingEmailSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const dispatch = useDispatch();
  // Get email from Redux store
  const reduxProfileData = useSelector((state) => {
    return state.profile.profile ? state.profile.profile.email : '';
  });

  console.log(reduxProfileData, "🔥 Profile Data from Redux");
  const userEmail = reduxProfileData || '';

  // NEW: Fetch existing email alert settings on component mount
  useEffect(() => {
    const fetchEmailAlertSettings = async () => {
      if (!userEmail) return;

      try {
        setSettingsLoading(true);
        console.log("🔍 Fetching existing email alert settings...");

        const response = await getApiEmailAlert();
        console.log("📧 Email Alert Settings Response:", response);

        if (response && response.length > 0) {
          const emailSetting = response[0]; // Assuming first item contains email settings
          setExistingEmailSettings(emailSetting);

          // Set current email alert display
          if (emailSetting.email_alerts) {
            const alertType = emailSetting.email_alerts;
            const displayLabel = alertType.charAt(0).toUpperCase() + alertType.slice(1);
            setCurrentEmailAlert(displayLabel);
            console.log("✅ Existing email alert found:", alertType);
          }
        } else {
          console.log("❌ No existing email alert settings found");
          setExistingEmailSettings(null);
        }

      } catch (error) {
        console.error("💥 Error fetching email alert settings:", error);
        setExistingEmailSettings(null);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchEmailAlertSettings();
  }, [userEmail]);

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
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Disabled", value: "disabled" }
  ];

  // Updated handleConfirmAction function
  const handleConfirmAction = async () => {
    try {
      setConfirmLoading(true);
      setConfirmError("");

      await deactivateAccount();

      console.log(`Account ${confirmAction} successful`);

      // Clear localStorage and sessionStorage
      dispatch(clearProfile());
      dispatch(logoutUser());           // authSlice
      dispatch(clearLoginData());       // loginSlice  
      dispatch(clearOnboardingData());  // onboardingSlice ✅
      dispatch(clearSavedSearches());   // savedSearchesSlice (new action)

      await persistor.purge();

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

  // UPDATED: Handle email alert selection with POST/PUT logic
  const handleEmailAlertSelect = async (option) => {
    try {
      setEmailAlertLoading(true);
      setShowEmailDropdown(false);

      const payload = {
        email_alerts: option.value,
        // email: userEmail  // Add email to payload for PUT request
      };

      console.log("📧 Email Alert Payload:", payload);
      console.log("🎯 Selected Option:", option);
      console.log("🔍 Existing Settings:", existingEmailSettings);

      let response;

      // Check if settings already exist
      if (existingEmailSettings && existingEmailSettings.id) {
        // UPDATE existing settings using PUT
        console.log("🔄 Updating existing email alert settings with ID:", existingEmailSettings.id);
        response = await EmailAlertUpdate(payload, existingEmailSettings.id);
        console.log("✅ Email Alert Updated Successfully:", response);
      } else {
        // CREATE new settings using POST
        console.log("➕ Creating new email alert settings");
        response = await emailAlert(payload);
        console.log("✅ Email Alert Created Successfully:", response);

        // Update local state with new settings
        setExistingEmailSettings(response);
      }

      // Update current display
      setCurrentEmailAlert(option.label);

      console.log("🎉 Email Alert Successfully Set to:", option.label);

    } catch (error) {
      console.error("💥 Error setting email alert:", error);
      console.log("🔴 API Error Details:", error.response?.data || error.message);
    } finally {
      setEmailAlertLoading(false);
      console.log("🔄 Email Alert Loading State Reset");
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
      setConfirmError("");
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
              className={`flex items-center justify-between border rounded-lg p-2 md:p-4 bg-white shadow-sm f transition ${item.action === "password" && isPasswordDisabled
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
                {/* {item.action === "email" && existingEmailSettings && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    ✓ Settings Found
                  </span>
                )} */}
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
                <div className="p-2 bg-gray-50 border-b">
                  <p className="text-xs text-gray-600">
                    {existingEmailSettings ?
                      `Updating existing settings (ID: ${existingEmailSettings.id})` :
                      "Creating new email alert settings"
                    }
                  </p>
                </div>
                {emailAlertOptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleEmailAlertSelect(option)}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition flex items-center justify-between ${index !== emailAlertOptions.length - 1 ? 'border-b border-gray-100' : ''
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
          setConfirmError("");
        }}
        onConfirm={handleConfirmAction}
        action={confirmAction}
        loading={confirmLoading}
        error={confirmError}
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