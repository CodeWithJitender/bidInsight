import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { getAllStates, updateProfile } from "../../services/user.service";
import { getUserProfile } from "../../services/bid.service";


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


  // States to store the list of states
  const [statesList, setStatesList] = useState([]);

  // Fetch all states when component mounts
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const states = await getAllStates();
        setStatesList(states); // assuming states is an array of objects
      } catch (error) {
        console.error("Failed to fetch states", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    // Fetch user profile and populate form
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(); // No profileId means "current user"
        setFormData({
          firstName: profile.full_name || "",
          username: profile.username || "",
          email: profile.email || "",
          companyName: profile.company_name || "",
          companyWebsite: profile.companyWebsite || "",
          companyFIEN: profile.fein_or_ssn_number || "",
          yearInBusiness: profile.year_in_business || "",
          employees: profile.no_of_employees || "1-10",     // Default option value
          contractSize: profile.target_contract_size || "upto-75000",
          state: profile.state || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchProfile();
  }, []);


  const constructPayload = (data) => ({

    full_name: data.firstName,
    state: data.state,  // Ye default selected id hai, direct bhej do
    company_name: data.companyName,
    no_of_employees: data.employees || "1-10",
  target_contract_size: data.contractSize || "upto-75000",
    year_in_business: Number(data.yearInBusiness),
  });
  console.log(constructPayload(formData), "Constructed Payload");



  const handleUpdateProfile = async () => {
    try {
      const payload = constructPayload(formData);
      console.log(payload, "Payload to be sent");
      const response = await updateProfile(payload); // updateProfile should send JSON

      console.log("Profile updated:", response);
      // Handle success UI, reload profile if needed
    } catch (error) {
      console.error("Update failed:", error);
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = async () => {
    if (isEditing) {
      // Save karne ke liye update API call karo
      await handleUpdateProfile();
    }
    setIsEditing(!isEditing);
  };

  console.log(formData, "Form Data");
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
            className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "bg-[#999999] cursor-not-allowed"
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
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "bg-[#999999] cursor-not-allowed"
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
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "bg-[#999999] cursor-not-allowed"
                }`}
            >
              <option value="">Select an option</option>
              <option value="1">1-3</option>
              <option value="4">4-7</option>
              <option value="8">8+</option>
            </select>
          </div>

          {/* No. of employees */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              No. of employees *
            </label>
            <select
              name="employees"
              value={formData.employees || "1-10"}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "bg-[#999999] cursor-not-allowed"
                }`}
            >
              <option value="">Select an option</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="50+">50+</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2" >State *</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "bg-[#999999] cursor-not-allowed"
                }`}
            >
              <option value="">Select a state</option>
              {statesList.map((stateObj) => (
                <option key={stateObj.id} value={stateObj.id}>
                  {stateObj.name}
                </option>
              ))}
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
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "bg-[#999999] cursor-not-allowed"
                }`}
            >
              <option value="">Select an option</option>
              <option value="upto-75000">Up to $75,000</option>
              <option value="75000-500000">$75,000 to $500,000</option>
              <option value="above-500000">Above $500,000</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
