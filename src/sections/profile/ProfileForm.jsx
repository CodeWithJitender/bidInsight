import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Angela Stark",
    username: "@angelastark",
    email: "joseph.mark12@gmail.com",
    companyName: "Angela Stark Enterprise",
    companyWebsite: "jopseph.mark12@gmail.com",
    yearInBusiness: "",
    employees: "",
    state: "",
    contractSize: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.yearInBusiness) newErrors.yearInBusiness = "This field is required";
    if (!formData.employees) newErrors.employees = "This field is required";
    if (!formData.state) newErrors.state = "This field is required";
    if (!formData.contractSize) newErrors.contractSize = "This field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Saved:", formData);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-6 font-inter">
      {/* Edit Button */}
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Personal Detail */}
      <h2 className="text-lg font-semibold mb-6">Personal Detail</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
              !isEditing && "bg-gray-100 cursor-not-allowed"
            }`}
            readOnly={!isEditing}
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
              !isEditing && "bg-gray-100 cursor-not-allowed"
            }`}
            readOnly={!isEditing}
          />
        </div>

        {/* Email with tooltip */}
        <div className="relative">
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
              !isEditing && "bg-gray-100 cursor-not-allowed"
            }`}
            readOnly={!isEditing}
          />
          <FiInfo
            className="absolute right-3 top-9 text-gray-400 cursor-pointer"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
        </div>
      </div>

      {/* Company Snapshot */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-6">Company Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-gray-100 cursor-not-allowed"
              }`}
              readOnly={!isEditing}
            />
          </div>

          {/* Company Website */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Company Website</label>
            <input
              type="text"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-gray-100 cursor-not-allowed"
              }`}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Extra Fields (Year, Employees, State, Contract Size) */}
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Year in business */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Year in business *</label>
            <select
              name="yearInBusiness"
              value={formData.yearInBusiness}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-gray-100 cursor-not-allowed"
              }`}
            >
              <option value="">Select an option</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
            {errors.yearInBusiness && <p className="text-red-500 text-xs mt-1">{errors.yearInBusiness}</p>}
          </div>

          {/* Employees */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">No. of employees *</label>
            <select
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-gray-100 cursor-not-allowed"
              }`}
            >
              <option value="">Select an option</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200+</option>
            </select>
            {errors.employees && <p className="text-red-500 text-xs mt-1">{errors.employees}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">State *</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-gray-100 cursor-not-allowed"
              }`}
            >
              <option value="">Select an option</option>
              <option value="California">California</option>
              <option value="Texas">Texas</option>
              <option value="Florida">Florida</option>
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          {/* Target contract size */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Target contract size *</label>
            <select
              name="contractSize"
              value={formData.contractSize}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-gray-100 cursor-not-allowed"
              }`}
            >
              <option value="">Select an option</option>
              <option value="Under $50k">Under $50k</option>
              <option value="$50k - $200k">$50k - $200k</option>
              <option value="$200k+">$200k+</option>
            </select>
            {errors.contractSize && <p className="text-red-500 text-xs mt-1">{errors.contractSize}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
