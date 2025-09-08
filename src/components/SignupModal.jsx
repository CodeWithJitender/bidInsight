import React, { useState } from "react";
import { X } from "lucide-react";

export default function SignupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
  });

  if (!isOpen) return null; // Hide when not open

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50  z-50 p-4 backdrop-blur-sm">
      <div className="relative bg-[url('/signupModal.jpg')] bg-cover bg-center text-white py-8 px-6  rounded-xl shadow-lg w-[100%] max-w-xl border border-gray-400">
        {/* Close button */}
        <button
          onClick={onClose}
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
          <div className="mb-3">
            <label className="block text-p font-archivo my-2">Enter your Email Id:</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-md text-black placeholder:text-[#696969] outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full p-4 rounded-md text-black placeholder:text-[#696969] outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center">

          <button
            type="submit"
            className=" bg-btn  transition py-4 px-6 rounded-full font-normal font-inter text-white"
            >
            Signup for Regular Updates
          </button>
              </div>
        </form>
      </div>
    </div>
  );
}
