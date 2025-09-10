import React, { useEffect, useState } from "react";
import BookmarkTable from "./BookmarkTable";
import { bookmarkedBids, followData } from "./bookmarkedBids"; // your data file
import { Link } from "react-router-dom";
import PersonalDetail from "./PersonalDetail";
import ProfileForm from "./ProfileForm";
import { getUserProfile } from "../../services/bid.service";

function Profile({fullName, lastLogin}) {
  console.log(fullName, lastLogin);


  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setProfileData(profile);
      console.log("Profile fetched:", profile);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    } finally {
      setLoading(false);
    }
  };

  // This function will be called by child component after successful update
  const handleProfileUpdate = async () => {
    console.log("Profile updated, refreshing data...");
    await fetchUserProfile(); // Re-fetch latest data
  };


    // const data = [
    //     {
    //         icon:"/profile-user.png",
    //         title:"Lorem Ipsum",
    //         pera:"It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the.",
    //         btn:"Complete Form",
    //         btnLink:"/"
    //     },
    //     {
    //         icon:"/profile-user.png",
    //         title:"Lorem Ipsum",
    //         pera:"It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the.",
    //         btn:"Complete Form",
    //         btnLink:"/"
    //     },
    //     {
    //         icon:"/profile-user.png",
    //         title:"Lorem Ipsum",
    //         pera:"It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the.",
    //         btn:"Complete Form",
    //         btnLink:"/"
    //     },
    //     {
    //         icon:"/profile-user.png",
    //         title:"Lorem Ipsum",
    //         pera:"It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the.",
    //         btn:"Complete Form",
    //         btnLink:"/"
    //     },
       
    // ]

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
      {/* <div className="border-2 border-primary p-4 rounded-[20px]">
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
          </div>
        </div>
        Progress cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
            {data.map((item, index)=>(
                <div className="card bg-primary p-4 rounded-xl flex flex-col gap-2 items-start" key={index}>
                    <div className="top flex gap-1 items-center">
                        <div className="icon"><img src={item.icon} className="max-w-6" alt="" /></div>
                        <div className="title text-lg font-medium text-white font-inter">{item.title}</div>
                    </div>
                    <div className="font-inter text-white text-sm">
                        {item.pera}
                    </div>
                    <Link to={item.btnLink} className=" bg-btn py-2 px-4 rounded-[50px] text-white mt-2">
                    {item.btn}
                    </Link>
                </div>
            ))}
        </div>
      </div> */}

      <PersonalDetail
        profileData={profileData}
        onProfileUpdate={handleProfileUpdate}
      />
      {/* <ProfileForm /> */}
    </div>
  );
}

export default Profile;
