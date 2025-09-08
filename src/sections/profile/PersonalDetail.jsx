import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";

export default function PersonalDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Angela Stark",
    username: "@angelastark",
    email: "jopseph.mark12@gmail.com",
    companyName: "Angela Stark Enterprise",
    companyWebsite: "jopseph.mark12@gmail.com",
    companyFIEN: "123456789",
    yearInBusiness: "",
    employees: "",
    state: "",
    contractSize: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      console.log("Saved Data:", formData);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mt-10 mb-3">
        <h2 className="text-2xl font-inter font-medium">Personal Detail</h2>
        <button
          onClick={toggleEdit}
          className="text-sm px-4 py-2 rounded-full bg-primary font-inter text-white hover:bg-blue-700 transition"
        >
          {isEditing ? (<div className=""><i class="fal fa-save"></i> Save</div>) : (<div className=""><i class="fal fa-pen-alt"></i> Edit</div>)}
        </button>
      </div>

      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
              !isEditing && "bg-[#999999] cursor-not-allowed"
            }`}
            readOnly={!isEditing}
          />
        </div>

        {/* Email with tooltip */}
        <div className="relative">
          <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-5 font-inter border rounded-md bg-[#999999] cursor-not-allowed"
            readOnly
            disabled
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
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-[#999999] cursor-not-allowed"
              }`}
              readOnly={!isEditing}
            />
          </div>

          {/* Company FIEN or SSN */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              Company FIEN or SSN
            </label>
            <input
              type="text"
              name="companyFIEN"
              value={formData.companyFIEN}
              onChange={handleChange}
              className={`w-full p-5 font-inter border rounded-md bg-[#999999] cursor-not-allowed`}
              readOnly={!isEditing}
              disabled
            />
          </div>

          {/* Year in business */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              Year in business *
            </label>
            <select
              name="yearInBusiness"
              value={formData.yearInBusiness}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-[#999999] cursor-not-allowed"
              }`}
            >
              <option value="">Select an option</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          {/* No. of employees */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              No. of employees *
            </label>
            <select
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-[#999999] cursor-not-allowed"
              }`}
            >
              <option value="">Select an option</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200+</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              State *
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-[#999999] cursor-not-allowed"
              }`}
            >
              <option value="">Select an option</option>
              <option value="California">California</option>
              <option value="Texas">Texas</option>
              <option value="Florida">Florida</option>
            </select>
          </div>

          {/* Target contract size */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              Target contract size *
            </label>
            <select
              name="contractSize"
              value={formData.contractSize}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditing && "bg-[#999999] cursor-not-allowed"
              }`}
            >
              <option value="">Select an option</option>
              <option value="Under $50k">Under $50k</option>
              <option value="$50k - $200k">$50k - $200k</option>
              <option value="$200k+">$200k+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
