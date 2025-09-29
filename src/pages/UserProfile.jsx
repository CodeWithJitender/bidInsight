import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import {
  faLink,
  faDatabase,
  faCog,
  faSignOutAlt,
  faBell,
  faSearch,
  faUser,
  faClipboardList,
  faGavel,
  faRobot,
  faChartLine,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Profile from "../sections/profile/Profile";
import MyPlans from "../sections/profile/MyPlans";
import Bids from "../sections/profile/Bids";
import AiToolset from "../sections/profile/AiToolset";
import AccountSetting from "../sections/profile/AccountSetting";
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from "../services/bid.service";
import { persistor } from '../redux/store';
import { clearProfile } from '../redux/reducer/profileSlice';
import { logoutUser } from "../redux/reducer/authSlice";
import { clearLoginData } from "../redux/reducer/loginSlice";
import { clearOnboardingData } from "../redux/reducer/onboardingSlice";
import { clearSavedSearches } from "../redux/reducer/savedSearchesSlice";
import { userPaymentTable, paymentRecipt } from "../services/user.service"; // ye add karo

export default function UserProfile() {
  const [active, setActive] = useState("Profile");
  const navigate = useNavigate(); // Add this line
  // Redux se data lena
  const profileData = useSelector((state) => state.profile.profile);
  const authData = useSelector((state) => state.auth.user);
  const loginData = useSelector((state) => state.login.user);

  const [profileDataa, setProfileDataa] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [freshProfileData, setFreshProfileData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  console.log("Auth Data:", authData);
  console.log("Login Data:", loginData);
  const dispatch = useDispatch();


  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const profile = await getUserProfile();
      setFreshProfileData(profile);  // YE CHANGE
      console.log("Profile fetched in UserProfile:", profile);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchPaymentData = async () => {
    try {
      setPaymentLoading(true);
      const payments = await userPaymentTable();

      console.log("Payment Data Response:", payments); // Console log
      setPaymentData(payments);
    } catch (error) {
      console.error("Failed to fetch payment data", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleReceiptDownload = async (paymentId) => {
    try {
      console.log("Downloading receipt for payment ID:", paymentId);
      const response = await paymentRecipt(paymentId);
      console.log("Receipt response:", response);

      if (response?.receipt_url) {
        window.open(response.receipt_url, '_blank');
      } else {
        console.error("No receipt URL found in response");
        alert("Receipt not available");
      }
    } catch (error) {
      console.error("Failed to download receipt:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };


  const handleProfileUpdate = async () => {
    console.log("Profile updated, refreshing data...");
    await fetchUserProfile();
  };

  useEffect(() => {
    fetchUserProfile();
    fetchPaymentData(); // ye line add karo
  }, []);


  // Full name nikalna
  const getFullName = () => {
    try {
      // Pehle fresh data se try karo
      if (freshProfileData?.full_name) {
        return freshProfileData.full_name;
      }

      // Fallback to Redux
      if (profileData?.full_name) {
        return profileData.full_name;
      }

      return 'User';
    } catch (error) {
      console.error('Error parsing profile:', error);
      return 'User';
    }
  };

  // Last login nikalna - pehle auth check karo, nahi to login se lo
  const getLastLogin = () => {
    try {
      // Pehle auth mein check karo
      if (authData) {
        const parsedAuth = typeof authData === 'string' ? JSON.parse(authData) : authData;
        if (parsedAuth?.last_login) {
          return formatDate(parsedAuth.last_login);
        }
      }

      // Auth mein nahi hai to login mein check karo
      if (loginData) {
        const parsedLogin = typeof loginData === 'string' ? JSON.parse(loginData) : loginData;
        if (parsedLogin?.last_login) {
          return formatDate(parsedLogin.last_login);
        }
      }

      return 'N/A';
    } catch (error) {
      console.error('Error parsing last login:', error);
      return 'N/A';
    }
  };

  // Date format change karna - "2025-09-07T08:40:09.756377Z" ko "07-09-2025" mein
 const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits only
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};
  const handleLogout = async () => {
    try {
      console.log("Logout clicked - starting cleanup...");

      // 🔥 Sabhi slices clear karo
      dispatch(clearProfile());
      dispatch(logoutUser());           // authSlice
      dispatch(clearLoginData());       // loginSlice  
      dispatch(clearOnboardingData());  // onboardingSlice ✅
      dispatch(clearSavedSearches());   // savedSearchesSlice (new action)

      await persistor.purge();
      localStorage.clear();
      sessionStorage.clear();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate("/login", { replace: true });
    }
  };

  // User data nikalna
  const getUserData = () => {
    try {
      // Pehle auth mein check karo
      if (authData) {
        const parsedAuth = typeof authData === 'string' ? JSON.parse(authData) : authData;
        if (parsedAuth?.user) {
          return parsedAuth.user;
        }
      }

      // Auth mein nahi hai to login mein check karo
      if (loginData) {
        const parsedLogin = typeof loginData === 'string' ? JSON.parse(loginData) : loginData;
        if (parsedLogin?.user) {
          return parsedLogin.user;
        }
      }

      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const fullName = getFullName();
  const lastLogin = getLastLogin();
  const userData = getUserData();

  console.log("Full Name:", fullName);
  console.log("Last Login:", lastLogin);
  console.log("User Data:", userData);

  const renderComponent = () => {
    switch (active) {
      case "Profile":
        return <Profile
          fullName={fullName}
          userData={userData}
          lastLogin={lastLogin}
          profileData={freshProfileData}
          onProfileUpdate={handleProfileUpdate}
          loading={profileLoading}
        />
      case "My Plans":
        return <MyPlans
          paymentData={paymentData}
          paymentLoading={paymentLoading}
          onReceiptDownload={handleReceiptDownload}
          profileData={freshProfileData}
        />;
      case "Bids":
        return <Bids />;
      case "AI Toolset":
        return <AiToolset />;
      case "Account Settings":
        return <AccountSetting
          fullName={fullName}
          userData={userData}
          lastLogin={lastLogin}
          profileData={profileData}
        />
      default:
        return <Profile fullName={fullName} userData={userData} lastLogin={lastLogin} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 text-white w-64 pe-6 py-6 flex flex-col justify-between h-screen bg-blue">
        <div>
          <h1 className="text-2xl font-bold mb-10 ps-4">
            <Link to="/">
              <img src="logo.png" alt="" />
            </Link>
          </h1>

          <nav className="flex flex-col gap-6">
            {[
              { title: "Profile", icon: faUser },
              { title: "My Plans", icon: faClipboardList },
              { title: "Bids", icon: faChartLine },
              { title: "AI Toolset", icon: faRobot },
              { title: "Account Settings", icon: faCog },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => setActive(item.title)}
                className={`flex items-center gap-3 text-lg p-2 ps-4 rounded-r-[50px] cursor-pointer transition font-inter ${active === item.title
                  ? "bg-white/50 text-white"
                  : "hover:text-blue-300"
                  }`}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.title}</span>
              </div>
            ))}
          </nav>
        </div>
        <div onClick={handleLogout} className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter ps-4 ">
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1  overflow-x-hidden relative h-screen">
        {/* Top Nav */}
        <div className="flex flex-wrap justify-between py-4 px-8 border-b-4 border-primary items-center gap-4 bg-white shadow-sm z-10 sticky top-0">
          {active === "Profile" ? (
            <button
              className="flex items-center gap-2 text-xl font-semibold text-zinc-900 transition"
              onClick={() => navigate("/dashboard")}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Dashboard</span>
            </button>
          ) : (
            <button  onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-xl font-semibold text-zinc-900 transition">
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Dashboard</span>
            </button>
          )}
          <div className="flex items-center gap-4">
            {/* <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search titles or organization or location"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="relative w-12 h-12 rounded-full border border-blue-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faBell} className="text-primary text-lg" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
            </div> */}
            <button className="bg-primary text-white px-4 font-archivo py-2 rounded-full hover:bg-blue-700 transition">
              Hi, {fullName}
            </button>
          </div>
        </div>

        {/* Dynamic Section */}
        <div className="h-full">{renderComponent()}</div>
      </main>
    </div>
  );
}