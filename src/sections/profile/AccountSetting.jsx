import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaUniversity,
  FaRedo,
  FaEnvelope,
  FaBan,
  FaTrash,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import CustomTooltip from "../../components/CustomTooltip";
import { forgotPasswordRequest, forgotPasswordVerify, emailAlert } from "../../services/user.service";



export default function AccountSetting({ fullName, lastLogin }) {
  console.log(lastLogin);
  
  // States for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    new_password: "",
    confirm_password: ""
  });
  const [errors, setErrors] = useState({});

  // NEW STATES for password change enhancement
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordCooldown, setPasswordCooldown] = useState(0);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(false);

  // NEW STATES for resend OTP functionality
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // States for email alert dropdown
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailAlertLoading, setEmailAlertLoading] = useState(false);
  const [currentEmailAlert, setCurrentEmailAlert] = useState("");

  // Get email from Redux store
  // Get email from Redux store
const reduxProfileData = useSelector((state) => { 
  return state.profile.profile ? state.profile.profile.email : '';
});

console.log(reduxProfileData, "🔥 Profile Data from Redux");

const userEmail = reduxProfileData || profileData?.email || '';
  // console.log("User Email from Redux:", userEmail);

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

  // Resend cooldown timer effect
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

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

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasCapital) {
      return "Password must contain at least one capital letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecial) {
      return "Password must contain at least one special character";
    }
    return "";
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
        setStep(1);
        
        // Start resend cooldown when modal opens
        setResendCooldown(40);
        setIsResendDisabled(true);
        
        setPasswordCooldown(40);
        
      } catch (error) {
        console.error("Error sending OTP:", error);
        
        setIsPasswordLoading(false);
        setIsPasswordDisabled(false);
        setPasswordCooldown(0);
      }
    } else if (action === "email") {
      setShowEmailDropdown(!showEmailDropdown);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (isResendDisabled) return;
    
    try {
      setResendLoading(true);
      
      await forgotPasswordRequest(userEmail);
      
      setFormData(prev => ({ ...prev, otp: "" }));
      setResendCooldown(40);
      setIsResendDisabled(true);
      
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setResendLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }
    
    if (!formData.new_password.trim()) {
      newErrors.new_password = "New password is required";
    } else {
      const passwordError = validatePassword(formData.new_password);
      if (passwordError) {
        newErrors.new_password = passwordError;
      }
    }
    
    if (!formData.confirm_password.trim()) {
      newErrors.confirm_password = "Confirm password is required";
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const payload = {
        email: userEmail,
        otp: formData.otp,
        new_password: formData.new_password
      };
      
      await forgotPasswordVerify(payload);
      setStep(2);
      
      setTimeout(() => {
        setIsModalOpen(false);
        setStep(1);
        setFormData({
          otp: "",
          new_password: "",
          confirm_password: ""
        });
        setErrors({});
      }, 2000);
      
    } catch (error) {
      console.error("Error resetting password:", error);
      
      // Enhanced error handling for OTP validation
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        
        // Handle OTP specific errors
        if (errorData.otp) {
          const otpError = errorData.otp[0];
          if (otpError.includes("Invalid") && otpError.includes("expired")) {
            setErrors({ otp: "Invalid or expired OTP. Please request a new one." });
          } else if (otpError.includes("Invalid")) {
            setErrors({ otp: "Invalid OTP. Please check and try again." });
          } else if (otpError.includes("expired")) {
            setErrors({ otp: "OTP has expired. Please request a new one." });
          } else {
            setErrors({ otp: otpError });
          }
        } else {
          // Handle other validation errors
          const newErrors = {};
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              newErrors[field] = errorData[field][0];
            } else {
              newErrors[field] = errorData[field];
            }
          });
          setErrors(newErrors);
        }
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Failed to reset password. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setStep(1);
    setFormData({
      otp: "",
      new_password: "",
      confirm_password: ""
    });
    setErrors({});
    // Reset resend states when modal closes
    setResendCooldown(0);
    setIsResendDisabled(true);
    setResendLoading(false);
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

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {step === 1 ? "Change Password" : "Password Changed!"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <FaTimes />
              </button>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    OTP has been sent to: <strong>{userEmail}</strong>
                  </p>
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}

                {/* OTP Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    disabled={loading}
                  />
                  {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
                  
                  {/* Resend OTP Section */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isResendDisabled || resendLoading}
                      className={`text-sm font-medium transition ${
                        isResendDisabled || resendLoading
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-700 cursor-pointer'
                      }`}
                    >
                      {resendLoading ? (
                        <span className="flex items-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border border-blue-500 border-t-transparent"></div>
                          Sending...
                        </span>
                      ) : (
                        'Resend OTP'
                      )}
                    </button>
                    
                    {resendCooldown > 0 && (
                      <span className="text-xs text-gray-500">
                        Resend in {resendCooldown}s
                      </span>
                    )}
                  </div>
                  
                  {/* Resend Timer Progress Bar */}
                  {resendCooldown > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full transition-all duration-1000" 
                          style={{ width: `${((40 - resendCooldown) / 40) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.new_password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      disabled={loading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>}
                  <div className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters with one capital letter, one number & one special character
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Password Changed Successfully!</h4>
                <p className="text-gray-600">Your password has been updated successfully.</p>
              </div>
            )}
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