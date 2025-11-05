// src/components/OnboardingProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OnboardingProtectedRoute = ({ children }) => {
  // Redux store se profile data nikalo
  const profile = useSelector((state) => state.profile?.profile);
  
  // Plan code check karo
  const planCode = profile?.subscription_plan?.plan_code;
  const planName = profile?.subscription_plan?.name;

  // Agar plan "001" hai ya "Sneak" hai ya "free" hai, to home redirect karo
  if (
    planCode === "001" || 
    planName?.toLowerCase() === "sneak" || 
    planName?.toLowerCase() === "free"
  ) {
    return <Navigate to="/" replace />;
  }

  // Agar paid plan hai to access do
  return children;
};

export default OnboardingProtectedRoute;