import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { getAllStates, updateProfile } from "../../services/user.service";
// import { getUserProfile } from "../../services/bid.service";


export default function PersonalDetail({ profileData, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    username: "",
    email: "",
    companyName: "",
    companyWebsite: "",
    companyFIEN: "",
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
    if (profileData) {
      setFormData({
        firstName: profileData.full_name || "",
        username: profileData.username || "",
        email: profileData.email || "",
        companyName: profileData.company_name || "",
        companyWebsite: profileData.companyWebsite || "",
        companyFIEN: profileData.fein_or_ssn_number || "",
        yearInBusiness: profileData.year_in_business || "",
        employees: profileData.no_of_employees || "1-10",
        contractSize: profileData.target_contract_size || "upto-75000",
        state: profileData.state || "",
      });
    }
  }, [profileData]);


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
      console.log("Updating profile with payload:", payload);
      
      const response = await updateProfile(payload);
      console.log("Profile updated successfully:", response);
      
      // Call parent's update function to refresh data
      if (onProfileUpdate) {
        await onProfileUpdate();
      }
      
      // Exit editing mode after successful update
      setIsEditing(false);
      
    } catch (error) {
      console.error("Update failed:", error);
      // You can add error handling UI here
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
            className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "  cursor-not-allowed"
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
            className="w-full p-5 font-inter border rounded-md   cursor-not-allowed"
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
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "  cursor-not-allowed"
                }`}
              readOnly={!isEditing}
            />
          </div>

          {/* Company FIEN or SSN */}
          {/* <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              Company FIEN or SSN
            </label>
            <input
              type="text"
              name="companyFIEN"
              value={formData.companyFIEN}
              onChange={handleChange}
              className={`w-full p-5 font-inter border rounded-md   cursor-not-allowed`}
              readOnly={!isEditing}
              disabled
            />
          </div> */}

          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              No. of Employees *
            </label>
            <select
              name="employees"
              value={formData.employees || "1-10"}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "  cursor-not-allowed"
                }`}
            >
              <option value="">Select an option</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="50+">50+</option>
            </select>
          </div>

          {/* Year in business */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              Year in Business *
            </label>
            <select
              name="yearInBusiness"
              value={formData.yearInBusiness}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "  cursor-not-allowed"
                }`}
            >
              <option value="">Select an option</option>
              <option value="1">1-3</option>
              <option value="4">4-7</option>
              <option value="8">8+</option>
            </select>
          </div>

          {/* No. of employees */}
          

          {/* State */}
        

          {/* Target contract size */}
          <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2">
              Target Contract Size *
            </label>
            <select
              name="contractSize"
              value={formData.contractSize}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "  cursor-not-allowed"
                }`}
            >
              <option value="">Select an option</option>
              <option value="upto-75000">Up to $75,000</option>
              <option value="75000-500000">$75,000 to $500,000</option>
              <option value="above-500000">Above $500,000</option>
            </select>
          </div>

            <div>
            <label className="block text-sm text-[#999999] font-inter font-medium mb-2" >State *</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-5 font-inter border rounded-md focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing && "  cursor-not-allowed"
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
        </div>
      </div>
    </div>
  );
}
