import React, { useState } from "react";
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
} from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import CustomTooltip from "../../components/CustomTooltip";
import { forgotPasswordRequest, forgotPasswordVerify } from "../../services/user.service"; // Adjust path

export default function AccountSetting({ fullName, lastLogin }) {
  console.log(lastLogin);
  
  // States for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 = OTP form, 2 = success
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    new_password: "",
    confirm_password: ""
  });
  const [errors, setErrors] = useState({});

  // Get email from Redux store
  const profileData = useSelector((state) => { 
    return state.profile.profile ? state.profile.profile.email : '';
    });

  console.log(profileData, "🔥 Profile Data from Redux");
  
  const userEmail = profileData || '';
  console.log("User Email from Redux:", userEmail);

  const settings = [
    {
      title: "Payment Mode",
      description: "Change your payment mode",
      tooltip: "Change your payment mode",
      icon: <FaUniversity className="text-primary text-xl" />,
      action: "payment"
    },
    {
      title: "Change Password",
      description: "Change your Password",
      tooltip: "Change your Password",
      icon: <FaRedo className="text-primary text-xl" />,
      action: "password"
    },
    {
      title: "Email Alert",
      description: "Update your Email Alerts",
      tooltip: "Update your Email Alerts",
      icon: <FaEnvelope className="text-primary text-xl" />,
      action: "email"
    },
    {
      title: "Account Disable",
      description: "Disable your account",
      tooltip: "Disable your account",
      icon: <FaBan className="text-primary text-xl" />,
      action: "disable"
    },
    {
      title: "Account Deletion",
      description: "Delete your account",
      tooltip: "Delete your account",
      icon: <FaTrash className="text-red-600 text-xl" />,
      action: "delete"
    },
  ];

  // Handle setting click
  const handleSettingClick = async (action) => {
    if (action === "password") {
      if (!userEmail) {
        alert("Email not found. Please login again.");
        return;
      }
      
      try {
        setLoading(true);
        // First API call - Send forgot password request
        await forgotPasswordRequest(userEmail);
        setIsModalOpen(true);
        setStep(1);
        alert("OTP sent to your email successfully!");
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    // Handle other actions here if needed
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters";
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
      
      // Second API call - Reset password
      const payload = {
        email: userEmail,
        otp: formData.otp,
        new_password: formData.new_password
      };
      
      await forgotPasswordVerify(payload);
      setStep(2);
      
      // Reset form after success
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
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to reset password. Please try again.");
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
  };

  return (
    <div className="p-4 xl:p-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white mb-8">
        {/* Left: Avatar + Greeting */}
        <div className="flex items-center gap-3">
          <img
            src="/userprofile.png"
            alt="User"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-gray-500 font-medium font-inter">Hello</p>
            <p className="text-2xl font-medium text-black font-inter">{fullName}</p>
          </div>
        </div>

        {/* Right: Signup Time */}
        <div className="text-right">
          <p className="text-sm text-[#999999] font-inter font-medium">Signup Time</p>
          <p className="text-lg font-medium text-black">{lastLogin}</p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold font-inter text-gray-800 mb-6">
        User Account Setting
      </h2>

      {/* Settings List */}
      <div className="space-y-4">
        {settings.map((item, i) => (
          <div className="max-w-2xl" key={i}>
            {/* Left: Label + Info Icon */}
            <div className="flex items-center gap-2 mb-3 w-full justify-between">
              <p className="text-sm font-medium text-gray-500 font-inter">{item.title}</p>
              <CustomTooltip title={item.tooltip} />
            </div>
            <div
              onClick={() => handleSettingClick(item.action)}
              className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* Center: Description */}
              <p className="text-base font-medium text-black">{item.description}</p>

              {/* Right: Action Icon */}
              <div>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
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
              /* OTP and Password Form */
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    OTP has been sent to: <strong>{userEmail}</strong>
                  </p>
                </div>

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
              /* Success Message */
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
    </div>
  );
}