import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [childrenLoaded, setChildrenLoaded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    setChildrenLoaded(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 2;
        clearInterval(interval);
        setIsLoading(false);
        return 100;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [location.pathname]);

  // Once children are available and loading is done, mark them as loaded
  useEffect(() => {
    if (!isLoading && children) {
      // Let React flush the children first
      const timer = setTimeout(() => setChildrenLoaded(true), 0);
      return () => clearTimeout(timer);
    }
  }, [isLoading, children]);

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
  ];

  const isHidden = hiddenRoutes.includes(location.pathname);

  return (
    <div className="relative">
      {!isHidden && <Header />}

      {isHidden ? (
        <main>{children}</main>
      ) : (
        <>
          {/* Children only after loading finishes */}
          {!isLoading && <main>{children}</main>}

          {/* Footer only after children are mounted */}
          {childrenLoaded && <Footer />}

          {/* Loader only for non-hidden routes */}
          {isLoading && (
            <div className="absolute inset-0 z-[5000] bg-white">
              <LoadingScreen progress={progress} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LayoutWrapper;
