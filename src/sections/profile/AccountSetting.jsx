import React from "react";
import {
  FaUniversity,
  FaRedo,
  FaEnvelope,
  FaBan,
  FaTrash,
} from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import CustomTooltip from "../../components/CustomTooltip";

export default function AccountSetting() {
  const settings = [
    {
      title: "Payment Mode",
      description: "Change your payment mode",
      tooltip: "Change your payment mode",
      icon: <FaUniversity className="text-primary text-xl" />,
    },
    {
      title: "Change Password",
      description: "Change your Password",
      tooltip: "Change your Password",
      icon: <FaRedo className="text-primary text-xl" />,
    },
    {
      title: "Email Alert",
      description: "Update your Email Alerts",
      tooltip: "Update your Email Alerts",
      icon: <FaEnvelope className="text-primary text-xl" />,
    },
    {
      title: "Account Disable",
      description: "Disable your account",
      tooltip: "Disable your account",
      icon: <FaBan className="text-primary text-xl" />,
    },
    {
      title: "Account Deletion",
      description: "Delete your account",
      tooltip: "Delete your account",
      icon: <FaTrash className="text-red-600 text-xl" />,
    },
  ];

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
            <p className="text-2xl font-medium text-black font-inter">Angela Stark</p>
          </div>
        </div>

        {/* Right: Signup Time */}
        <div className="text-right">
          <p className="text-sm text-[#999999] font-inter font-medium">Signup Time</p>
          <p className="text-lg font-medium text-black">25-08-2025</p>
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
              key={i}
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
    </div>
  );
}
