import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SignupModal({ isOpen, onClose, onSubmit, submissionStatus, resetStatus }) {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
  });

  useEffect(() => {
    if (submissionStatus === "success") {
      // Reset form after success
      setTimeout(() => {
        setFormData({ email: "", fullName: "" });
      }, 2000);
    }
  }, [submissionStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null; // Hide when not open

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData); // Parent handles all state management
    } catch (err) {
      // Error handling if needed
    }
  };

  const handleClose = () => {
    if (resetStatus) resetStatus();
    setFormData({ email: "", fullName: "" });
    onClose();
  };

  // Already submitted state
  if (submissionStatus === "already_submitted") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 backdrop-blur-sm">
        <div className="relative bg-[url('/signupModal.jpg')] bg-cover bg-center text-white py-8 px-6 rounded-xl shadow-lg w-[100%] max-w-xl border border-gray-400">
          <button onClick={handleClose} className="absolute top-3 right-3 text-white hover:text-gray-300">
            <X size={20} />
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">You're Already Registered!</h3>
            <p className="text-gray-200">We'll notify you when AI Toolset is ready.</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (submissionStatus === "success") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 backdrop-blur-sm">
        <div className="relative bg-[url('/signupModal.jpg')] bg-cover bg-center text-white py-8 px-6 rounded-xl shadow-lg w-[100%] max-w-xl border border-gray-400">
          <button onClick={handleClose} className="absolute top-3 right-3 text-white hover:text-gray-300">
            <X size={20} />
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-200">We'll contact you when AI Toolset is ready.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative bg-[url('/signupModal.jpg')]  bg-cover bg-center text-white py-6 px-6  rounded-xl shadow-lg w-[100%] max-w-xl border border-gray-400">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white hover:text-gray-300"
        >
          <X size={20} />
        </button>

        {/* Logo + Title */}
        <h2 className="text-xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
         <img src="/logo.png" className="max-w-52 mb-3" alt="" />
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 md:max-w-[90%] mx-auto">
          {/* Email */}
          <div className="mb-2">
            <label className="block text-p font-archivo my-2">Enter your Email Id:</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={submissionStatus === "loading"}
              className="w-full p-4 rounded-md text-black placeholder:text-[#696969] outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-p font-archivo my-2">Full Name:</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={submissionStatus === "loading"}
              className="w-full p-4 rounded-md text-black placeholder:text-[#696969] outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-btn transition py-4 px-6 rounded-full font-normal font-inter text-white disabled:opacity-50"
              disabled={submissionStatus === "loading"}
            >
              {submissionStatus === "loading" ? "Submitting..." : "Signup for Regular Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}