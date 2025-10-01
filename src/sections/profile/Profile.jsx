import React, { useEffect, useState } from "react";
import BookmarkTable from "./BookmarkTable";
import { bookmarkedBids, followData } from "./bookmarkedBids"; // your data file
import { Link, useNavigate } from "react-router-dom";
import PersonalDetail from "./PersonalDetail";
import ProfileForm from "./ProfileForm";
import { getUserProfile } from "../../services/bid.service";
import {
  fetchUserProfile,
  selectCompletionPercentage,
  selectIsProfileComplete,
  selectPageCompletion
} from "../../redux/reducer/profileSlice";
import { useDispatch, useSelector } from "react-redux";


function Profile({ fullName, lastLogin, profileData, onProfileUpdate, loading }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();


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

  // Get subscription plan from Redux
  const subscriptionPlan = useSelector((state) => state.profile?.profile?.subscription_plan);
  const planCode = subscriptionPlan?.plan_code;

  console.log("Plan Code:", planCode); // Debug log

  // ⭐ Redux se completion data
  const completionPercentage = useSelector(selectCompletionPercentage);
  const isComplete = useSelector(selectIsProfileComplete);
  const pages = useSelector(selectPageCompletion);

  // ⭐ Calculate filled bars (6 total)
  const filledBars = Math.floor((completionPercentage / 100) * 6);

  // ⭐ Get next incomplete page
  const getNextIncompletePage = () => {
    const pageRoutes = [
      { name: 'geographicCoverage', route: '/geographic-coverage' },
      { name: 'industryCategories', route: '/industry-categories' },
      { name: 'helpOurAi', route: '/help-our-ai' },
      { name: 'extraData', route: '/extra-data' }
    ];

    for (const page of pageRoutes) {
      const pageStatus = pages[page.name];

      // Skip if already completed or skipped
      if (pageStatus?.completed || pageStatus?.skipped) {
        continue;
      }

      // Check Page 4 dependency
      if (page.name === 'extraData') {
        const helpOurAiPage = pages.helpOurAi;
        if (helpOurAiPage?.skipped) continue;
      }

      return page.route;
    }

    return null; // All complete
  };

  // ⭐ Handle Complete Form button
  const handleCompleteForm = () => {
    if (isComplete) {
      // Profile complete hai - edit ke liye first page pe bhejo
      navigate('/geographic-coverage');
    } else {
      // Profile incomplete - next incomplete page pe bhejo
      const nextRoute = getNextIncompletePage();
      if (nextRoute) {
        navigate(nextRoute);
      }
    }
  };

  // ⭐ Debug logs (optional - remove in production)
  // ⭐ Debug logs (optional - remove in production)
  useEffect(() => {
    console.log("📊 Completion Percentage:", completionPercentage);
    console.log("✅ Is Complete:", isComplete);
    console.log("📄 Pages Status:", pages);
  }, [completionPercentage, isComplete, pages]);

  // ⭐ NEW: Fetch fresh profile data on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
    console.log("🔥 Fetching fresh profile data on user-profile page");
  }, [dispatch]);

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
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-gray-500 font-medium font-inter">
              Hello
            </p>
            <p className="text-2xl font-medium text-black font-inter">
              {profileData?.full_name || fullName}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-[#999999] font-inter font-medium">
            Signup Time
          </p>
          <p className="text-lg font-medium text-black">{lastLogin}</p>
        </div>
      </div>

      {/* ⭐ UPDATED: Complete verification process */}
      {/* ⭐ CONDITIONAL: Show only if NOT plan 001 */}
      {planCode !== "001" && (
        <div className="border-2 border-primary p-4 rounded-[20px]">
          <div className="flex justify-between gap-4 flex-wrap">
            <div className="title font-inter font-medium text-2xl">
              Complete verification process
            </div>

            <div className="progress flex gap-4 items-center">
              <div className="text-[#999999] font-inter font-medium text-sm">
                Progress till far
              </div>

              {/* ⭐ DYNAMIC Progress Bars */}
              <div className="flex w-[300px] gap-1">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className={`pro h-2 w-[20%] rounded-md transition-all duration-300 ${index < filledBars ? 'bg-primary' : 'bg-[#EAEAEA]'
                      }`}
                  />
                ))}
              </div>

              {/* ⭐ DYNAMIC Percentage */}
              <div className="font-inter font-medium text-sm text-primary">
                {completionPercentage}% Completed
              </div>

              {/* ⭐ CONDITIONAL Button/Success Message */}
              <button
                onClick={handleCompleteForm}
                className="text-white border-2 px-4 py-2 rounded-3xl bg-primary hover:bg-primary/90 transition-colors"
              >
                {isComplete ? 'Update Profile' : 'Complete Form'}
              </button>
            </div>
          </div>
        </div>
      )}

      <PersonalDetail
        profileData={profileData}
        onProfileUpdate={onProfileUpdate}
      />
    </div>
  );
}

export default Profile;
