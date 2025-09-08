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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // save action can be API call here
      console.log("Saved Data:", formData);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Personal Detail</h2>
        <button
          onClick={toggleEdit}
          className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Form */}
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
            <label className="block text-sm text-gray-500 mb-1">Company website</label>
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
    </div>
  );
}
