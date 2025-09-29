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
  deactivateAccount,
  deleteRequest,
  confirmDelete
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

  // States for confirmation popup (for disable action)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  // NEW: States for DELETE with OTP popup
  const [showDeleteOtpPopup, setShowDeleteOtpPopup] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState("");
  const [deleteOtpLoading, setDeleteOtpLoading] = useState(false);
  const [deleteOtpError, setDeleteOtpError] = useState("");

  // States for password change enhancement
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordCooldown, setPasswordCooldown] = useState(0);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(false);

  // States for email alert dropdown
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailAlertLoading, setEmailAlertLoading] = useState(false);
  const [currentEmailAlert, setCurrentEmailAlert] = useState("");

  // States for existing email alert settings
  const [existingEmailSettings, setExistingEmailSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const dispatch = useDispatch();
  
  // Get email from Redux store
  const reduxProfileData = useSelector((state) => {
    return state.profile.profile ? state.profile.profile.email : '';
  });

  console.log(reduxProfileData, "🔥 Profile Data from Redux");
  const userEmail = reduxProfileData || '';

  // Fetch existing email alert settings on component mount
  useEffect(() => {
    const fetchEmailAlertSettings = async () => {
      if (!userEmail) return;

      try {
        setSettingsLoading(true);
        console.log("🔍 Fetching existing email alert settings...");

        const response = await getApiEmailAlert();
        console.log("📧 Email Alert Settings Response:", response);

        if (response && response.length > 0) {
          const emailSetting = response[0];
          setExistingEmailSettings(emailSetting);

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

  // Handle DISABLE action (existing functionality)
  const handleConfirmAction = async () => {
    try {
      setConfirmLoading(true);
      setConfirmError("");

      await deactivateAccount();

      console.log(`Account ${confirmAction} successful`);

      // Clear localStorage and sessionStorage
      dispatch(clearProfile());
      dispatch(logoutUser());
      dispatch(clearLoginData());
      dispatch(clearOnboardingData());
      dispatch(clearSavedSearches());

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

  // NEW: Handle DELETE REQUEST (First API call - sends OTP)
  const handleDeleteRequest = async () => {
    try {
      console.log("🗑️ Initiating delete request...");
      
      const response = await deleteRequest();
      console.log("✅ Delete request successful, OTP sent:", response);

      // Show OTP popup
      setShowDeleteOtpPopup(true);
      setDeleteOtp("");
      setDeleteOtpError("");

    } catch (error) {
      console.error("💥 Error in delete request:", error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  // NEW: Handle CONFIRM DELETE (Second API call with OTP)
  const handleConfirmDelete = async () => {
    if (!deleteOtp || deleteOtp.trim().length === 0) {
      setDeleteOtpError("Please enter OTP");
      return;
    }

    try {
      setDeleteOtpLoading(true);
      setDeleteOtpError("");

      console.log("🔐 Confirming delete with OTP:", deleteOtp);

      const payload = { otp: deleteOtp };
      const response = await confirmDelete(payload);

      console.log("✅ Account deletion confirmed:", response);

      // Clear all data and logout
      dispatch(clearProfile());
      dispatch(logoutUser());
      dispatch(clearLoginData());
      dispatch(clearOnboardingData());
      dispatch(clearSavedSearches());

      await persistor.purge();

      localStorage.clear();
      sessionStorage.clear();

      // Close popup
      setShowDeleteOtpPopup(false);

      // Redirect to login
      navigate('/login');

    } catch (error) {
      console.error("💥 Error confirming delete:", error);

      let errorMessage = "Invalid OTP. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setDeleteOtpError(errorMessage);

    } finally {
      setDeleteOtpLoading(false);
    }
  };

  // Handle email alert selection with POST/PUT logic
  const handleEmailAlertSelect = async (option) => {
    try {
      setEmailAlertLoading(true);
      setShowEmailDropdown(false);

      const payload = {
        email_alerts: option.value,
      };

      console.log("📧 Email Alert Payload:", payload);
      console.log("🎯 Selected Option:", option);
      console.log("🔍 Existing Settings:", existingEmailSettings);

      let response;

      if (existingEmailSettings && existingEmailSettings.id) {
        console.log("🔄 Updating existing email alert settings with ID:", existingEmailSettings.id);
        response = await EmailAlertUpdate(payload, existingEmailSettings.id);
        console.log("✅ Email Alert Updated Successfully:", response);
      } else {
        console.log("➕ Creating new email alert settings");
        response = await emailAlert(payload);
        console.log("✅ Email Alert Created Successfully:", response);

        setExistingEmailSettings(response);
      }

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
    } else if (action === "disable") {
      // Show confirmation popup for DISABLE
      setConfirmAction(action);
      setConfirmError("");
      setShowConfirmPopup(true);
    } else if (action === "delete") {
      // Call delete request API (sends OTP)
      handleDeleteRequest();
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
              className={`flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm transition ${item.action === "password" && isPasswordDisabled
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

      {/* Confirmation Modal Component for DISABLE (existing functionality) */}
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

      {/* NEW: OTP Popup for DELETE */}
      {showDeleteOtpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
          <div className="relative w-full max-w-[500px] bg-blue text-white rounded-2xl border border-[#DBDFFF] p-8 shadow-xl">
            
            {/* Title */}
            <div className="max-w-2xl mx-auto text-center mb-6">
              <h1 className="h3 font-bold font-archivo text-g mb-3">
                Confirm Account Deletion
              </h1>
              <p className="text-lg font-inter mb-2">
                Enter the OTP sent to your email
              </p>
              <p className="text-base font-inter opacity-80">
                This action is irreversible. All your data will be permanently deleted.
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <input
                type="text"
                value={deleteOtp}
                onChange={(e) => setDeleteOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg text-black text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-white"
              />
              {deleteOtpError && (
                <p className="text-red-300 text-sm mt-2 text-center">{deleteOtpError}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="grid sm:grid-cols-2 justify-center gap-6">
              <button
                onClick={() => {
                  setShowDeleteOtpPopup(false);
                  setDeleteOtp("");
                  setDeleteOtpError("");
                }}
                disabled={deleteOtpLoading}
                className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl border border-white/50 text-white hover:bg-white/20 transition text-center disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirmDelete}
                disabled={deleteOtpLoading}
                className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl transition text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 bg-red-900 hover:bg-red-800"
              >
                {deleteOtpLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>

            {/* Warning */}
            <div className="text-xs font-inter mt-4 w-full text-center leading-tight">
              <b className="text-red-300">⚠️ WARNING:</b> This action cannot be undone!
            </div>
          </div>
        </div>
      )}

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