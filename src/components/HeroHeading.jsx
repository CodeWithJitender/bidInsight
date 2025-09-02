import React from "react";
import Button from "./Button";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

function HeroHeading({ data, profileBids, profileLoading, profileError }) {
  const { title, para, btnText, btnLink, container, headingSize = "h1", pSize = "text-lg" } = data;
    // console.log(profileBids)
  const headingRef = useRef();
  const containerRef = useRef();

  // 🔥 Company name extract karne ka function - Now uses props instead of Redux
  const getCompanyName = () => {
    if (profileLoading) return "Loading...";
    if (profileError) return "Dashboard";
    
    // 🔥 Handle undefined/null cases first
    if (!profileBids) return "Dashboard";
    
    // 🔥 API Response Format: { user: { company_name: "value" } }
    if (profileBids && typeof profileBids === 'object' && !Array.isArray(profileBids)) {
      // Check if user object exists and has company_name
      if (profileBids.user && profileBids.user.company_name) {
        return profileBids.user.company_name;
      }
    }
    
    // Check if profileBids is array and has data (fallback)
    if (Array.isArray(profileBids) && profileBids.length > 0) {
      const firstItem = profileBids[0];
      if (firstItem?.user?.company_name) {
        return firstItem.user.company_name;
      }
      return firstItem?.company_name || "Dashboard";
    }
    
    return "Dashboard"; // Fallback
  };

  // 🔥 Personalized title create karo
  const getPersonalizedTitle = () => {
    const companyName = getCompanyName();
    
    if (title === "Dashboard") {
      return companyName === "Dashboard" ? "Dashboard" : `${companyName} Dashboard`;
    }
    
    return title; // Agar title "Dashboard" nahi hai to original title return karo
  };

  // console.log("🔥 HeroHeading - profileBids (from props):", profileBids);
  // console.log("🔥 HeroHeading - profileLoading:", profileLoading);
  // console.log("🔥 HeroHeading - profileError:", profileError);
  // console.log("🔥 HeroHeading - Company Name:", getCompanyName());
  // console.log("🔥 HeroHeading - Personalized Title:", getPersonalizedTitle());

  return (
    <div className="hero-heading" ref={containerRef}>
      <div className={`${container}`}>
        {title && (
          <h1 className={`${headingSize} font-bold text-g font-h`} data-aos="fade-up">
            {getPersonalizedTitle()}
          </h1>
        )}
        {para && (
          <p className={`${pSize} font-t mt-5 mb-8 text-gray-200`} data-aos="fade-up" data-aos-delay="100">
            {para}
          </p>
        )}
        {btnText && (
          <div className="flex justify-center" data-aos="fade-up" data-aos-delay="200">
            <Button
              text={btnText}
              link={btnLink}
              arrowBg={"bg-primary text-white"}
              btnBg={"bg-white"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroHeading;