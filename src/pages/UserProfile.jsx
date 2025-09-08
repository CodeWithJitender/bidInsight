import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";
import Profile from "../sections/profile/Profile";
import MyPlans from "../sections/profile/MyPlans";
import Bids from "../sections/profile/Bids";
import AiToolset from "../sections/profile/AiToolset";
import AccountSetting from "../sections/profile/AccountSetting";

/* Dummy components for sections
const Profile = () => <div className="p-8">Profile Component</div>;
const MyPlans = () => <div className="p-8">My Plans Component</div>;
const Bids = () => <div className="p-8">Bids Component</div>;
const AiToolset = () => <div className="p-8">AI Toolset Component</div>;
const AccountSetting = () => (
  <div className="p-8">Account Setting Component</div>
); */

export default function UserProfile() {
  const [active, setActive] = useState("Profile");

  const renderComponent = () => {
    switch (active) {
      case "Profile":
        return <Profile />;
      case "My Plans":
        return <MyPlans />;
      case "Bids":
        return <Bids />;
      case "AI Toolset":
        return <AiToolset />;
      case "Account Setting":
        return <AccountSetting />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 text-white w-64 pe-6 py-6 flex flex-col justify-between h-screen bg-blue">
        <div>
          <h1 className="text-2xl font-bold mb-10 ps-4">
            <img src="logo.png" alt="" />
          </h1>
          <nav className="flex flex-col gap-6">
            {[
              { title: "Profile", icon: faUser },
              { title: "My Plans", icon: faClipboardList },
              { title: "Bids", icon: faChartLine },
              { title: "AI Toolset", icon: faRobot },
              { title: "Account Setting", icon: faCog },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => setActive(item.title)}
                className={`flex items-center gap-3 text-lg p-2 ps-4 rounded-r-[50px] cursor-pointer transition font-inter ${
                  active === item.title
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
        <div className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-300 transition font-inter ps-4 ">
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1  overflow-x-hidden relative h-screen">
        {/* Top Nav */}
        <div className="flex flex-wrap justify-between py-4 px-8 border-b-4 border-primary items-center gap-4 bg-white shadow-sm z-10 sticky top-0">
          <h2 className="text-2xl font-semibold font-archivo text-gray-800">
            {active}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
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
            </div>
            <button className="bg-primary text-white px-4 font-archivo py-2 rounded-full hover:bg-blue-700 transition">
              Hi, Angela
            </button>
          </div>
        </div>

        {/* Dynamic Section */}
        <div >{renderComponent()}</div>
      </main>
    </div>
  );
}
