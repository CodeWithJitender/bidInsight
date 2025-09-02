import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 2; // step size
        clearInterval(interval);
        setIsLoading(false);
        return 100;
      });
    }, 30); // speed of progress

    return () => clearInterval(interval);
  }, [location.pathname]);

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
    // "/dashboard",
    "/plan",
    "/loader",
    "/super-admin",
    // "/pricing"
  ];

  const isHidden = hiddenRoutes.includes(location.pathname);

  return (
    <div className="relative">
      {!isHidden && <Header />}
      {!isLoading && <main>{children}</main>}
      {!isLoading && !isHidden && <Footer />}

      {isLoading && (
        <div className="">
          <LoadingScreen progress={progress} />
        </div>
      )}
    </div>
  );
};

export default LayoutWrapper;
