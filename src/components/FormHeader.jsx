import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/logo.png"; // Adjust if your path differs
import NeedHelpModal from "./NeedHelpModal";

function FormHeader({ title, link, steps = 0, activeStep = 0 }) {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("access_token");
  console.log(token);

  return (
    <div className="form-header mb-6">
      <div className="form-inner flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="logo max-w-[150px]">
          <Link to="/">
            <img src={logo} alt="BidInsight Logo" className="w-full" />
          </Link>
        </div>

        {/* Header Links */}
        {/* Header Links */}
        <div className="header-link flex justify-between gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div
            className="text-white text-lg hover:underline cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Need help?
          </div>

          {/* Sirf tab dikhana jab token na ho */}
          {!token && (
            <Link to={link} className="text-white text-lg hover:underline">
              {title}
            </Link>
          )}
        </div>

      </div>

      {/* Progress Bar */}
      {steps && (
        <div className="process-line flex items-center justify-between mt-3 h-10 gap-4 w-full">
          {Array.from({ length: steps }).map((_, index) => (
            <div
              key={index}
              className={`line-items flex-1 h-2 rounded-full transition-all duration-300 ${index <= activeStep ? "bg-white" : "bg-[#273BE2]"
                }`}
            ></div>
          ))}
        </div>
      )}
      {showModal && (
        <NeedHelpModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default FormHeader;
