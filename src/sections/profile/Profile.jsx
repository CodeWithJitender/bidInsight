import React, { useEffect, useState } from "react";
import BookmarkTable from "./BookmarkTable";
import { bookmarkedBids, followData } from "./bookmarkedBids"; // your data file
import { Link } from "react-router-dom";
import PersonalDetail from "./PersonalDetail";
import ProfileForm from "./ProfileForm";
import { getUserProfile } from "../../services/bid.service";

function Profile({ fullName, lastLogin, profileData, onProfileUpdate, loading }) {
  console.log(fullName, lastLogin);


  const data = [
  {
    icon: "/icons/id-card.svg",
    title: "Verify Identity",
    pera: "Upload your government issued ID to verify your account.",
    btn: "Verify Now",
    btnLink: "/verify-identity",
  },
  {
    icon: "/icons/email.svg",
    title: "Verify Email",
    pera: "Confirm your email to secure your account.",
    btn: "Verify Email",
    btnLink: "/verify-email",
  },
  {
    icon: "/icons/phone.svg",
    title: "Verify Phone",
    pera: "Add and verify your phone number.",
    btn: "Verify Phone",
    btnLink: "/verify-phone",
  },
   {
    icon: "/icons/email.svg",
    title: "Verify Email",
    pera: "Confirm your email to secure your account.",
    btn: "Verify Email",
    btnLink: "/verify-email",
  },
];



  if (loading) {
    return (
      <div className="p-4 xl:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 xl:p-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white mb-8">
        {/* Left: Avatar + Greeting */}
        <div className="flex items-center gap-3">
          {/* <img
            src="/userprofile.png"
            alt="User"
            className="w-16 h-16 rounded-full object-cover"
          /> */}
          <div>
            <p className="text-sm text-gray-500 font-medium font-inter">
              Hello
            </p>
            <p className="text-2xl font-medium text-black font-inter">
              {profileData?.full_name || fullName}
            </p>
          </div>
        </div>

        {/* Right: Signup Time */}
        <div className="text-right">
          <p className="text-sm text-[#999999] font-inter font-medium">
            Signup Time
          </p>
          <p className="text-lg font-medium text-black">{lastLogin}</p>
        </div>
      </div>
      {/* Complete verification process */}
      <div className="border-2 border-primary p-4 rounded-[20px]">
        Progress
        <div className="flex justify-between gap-4 flex-wrap">
          <div className="title font-inter font-medium text-2xl ">
            Complete verification process
          </div>
          <div className="progress flex gap-4 items-center">
            <div className="text-[#999999] font-inter font-medium text-sm ">
              Progress till far
            </div>
            <div className="flex w-[300px] gap-1">
              <div className="pro h-2 w-[20%] gap-3 bg-primary rounded-md"></div>
              <div className="pro h-2 w-[20%] gap-3 bg-primary rounded-md"></div>
              <div className="pro h-2 w-[20%] gap-3 bg-primary rounded-md"></div>
              <div className="pro h-2 w-[20%] gap-3 bg-primary rounded-md"></div>
              <div className="pro h-2 w-[20%] gap-3 bg-[#EAEAEA] rounded-md"></div>
              <div className="pro h-2 w-[20%] gap-3 bg-[#EAEAEA] rounded-md"></div>
            </div>
            <div className="font-inter font-medium text-sm text-primary">
              70% Completed
            </div>

            <button className="text-white border-2 px-4 py-2 rounded-3xl bg-primary">Complete Form</button>
          </div>
        </div>
     
      </div>

      <PersonalDetail
        profileData={profileData}

        onProfileUpdate={onProfileUpdate} // Ye ab parent se aayega
      />
      {/* <ProfileForm /> */}
    </div>
  );
}

export default Profile;
