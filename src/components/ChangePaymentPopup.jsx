import React from "react";
import { Link } from "react-router-dom";

const ChangePaymentPopup = () => {
  return (
    <div className="fixed inset-0 z-50 md:flex items-center justify-center bg-blue backdrop-blur-sm p-4 overflow-y-scroll">
      {/* Card */}
      <div className="relative w-full max-w-[500px] bg-blue text-white rounded-2xl border border-[#DBDFFF] p-8 shadow-xl">
        {/* Close Button */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
        >
          &times;
        </button> */}

        {/* Icon / Image */}
        <div className="flex justify-center mb-6">
          {/* {content.image && ( */}
            <img
              src='payment-successfull.png'
              alt="Payment Status"
              className="max-w-[120px]"
            />
          {/* )} */}
        </div>

        {/* Title & Description */}
        <div className="max-w-2xl mx-auto text-center">
          {/* {content.title && ( */}
            <h1 className="h3 font-bold font-archivo text-g mb-3">
              Payment Method Changed Successfully
            </h1>
          {/* )} */}
        
        </div>

       

        {/* Buttons */}
        <div className="mt-10 flex justify-center">
  <Link
    to="/dashboard"
    className="border border-gray-400 px-6 py-2 rounded-lg text-white transition-all duration-200"
  >
    Go back to Dashboard
  </Link>
</div>

    
      </div>
    </div>
  );
};

export default ChangePaymentPopup;

