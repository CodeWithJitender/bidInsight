import React, { useState, useEffect } from "react";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { forgotPasswordRequest, forgotPasswordVerify } from "../../services/user.service";

export default function ChangePasswordModal({ isModalOpen, setIsModalOpen, userEmail }) {
  // Modal states
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    new_password: "",
    confirm_password: ""
  });
  const [errors, setErrors] = useState({});

  // NEW STATES for resend OTP functionality
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

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

  // Start resend cooldown when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setResendCooldown(40);
      setIsResendDisabled(true);
    }
  }, [isModalOpen]);

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
        closeModal();
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

  if (!isModalOpen) return null;

  return (
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
  );
}