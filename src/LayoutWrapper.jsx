import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const [windowLoaded, setWindowLoaded] = useState(false);

  const hiddenRoutes = [
    "/login",
    "/forgot-password",
    "/signup",
    "/register",
    "/company-build",
    "/geographic-coverage",
    "/help-our-ai",
    "/industry-categories",
    "/extra-data",
    "/verification",
    "/plan",
    "/loader",
    "/super-admin",
    "/user-profile",
    "/payment",
    "/forgot-password",
    "/confirm-password",
  ];

  const isHidden = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    const handleLoad = () => {
      setWindowLoaded(true);
    };

    // If window already loaded before effect runs
    if (document.readyState === "complete") {
      setTimeout(()=>{
        setWindowLoaded(true);
      }, 2000)
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className="relative">
      {!isHidden && <Header />}
      <main>{children}</main>
      {!isHidden && windowLoaded && <Footer />}
    </div>
  );
};

export default LayoutWrapper;