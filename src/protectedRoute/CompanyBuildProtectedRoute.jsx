// src/components/CompanyBuildProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const CompanyBuildProtectedRoute = ({ children }) => {
  const companyBuildFields = sessionStorage.getItem("companyBuildFields");

  const isCompanyBuildValid = () => {
    try {
      const parsed = JSON.parse(companyBuildFields);
      return parsed && typeof parsed === "object";
    } catch (err) {
      return false;
    }
  };

  if (!companyBuildFields || !isCompanyBuildValid()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default CompanyBuildProtectedRoute;
