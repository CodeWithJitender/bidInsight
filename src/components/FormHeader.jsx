// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import logo from "/logo.png"; // Adjust if your path differs

// function FormHeader({ title, link, steps = 0, activeStep = 0 }) {
//   const location = useLocation();

//   return (
//     <div className="form-header mb-6">
//       <div className="form-inner flex flex-col md:flex-row justify-between items-center">
//         {/* Logo */}
//         <div className="logo max-w-[150px]">
//           <Link to="/">
//             <img src={logo} alt="BidInsight Logo" className="w-full" />
//           </Link>
//         </div>

//         {/* Header Links */}
//         <div className="header-link flex justify-between gap-4 w-full md:w-auto mt-4 md:mt-0">
//           <Link to="/login" className="text-white text-lg hover:underline">
//             Need help?
//           </Link>
//           <Link to={link} className="text-white text-lg hover:underline">
//             {title}
//           </Link>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       {steps && (
//         <div className="process-line flex items-center justify-between mt-3 h-10 gap-4 w-full">
//           {Array.from({ length: steps }).map((_, index) => (
//             <div
//               key={index}
//               className={`line-items flex-1 h-2 rounded-full transition-all duration-300 ${
//                 index <= activeStep ? "bg-white" : "bg-[#273BE2]"
//               }`}
//             ></div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default FormHeader;











import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/logo.png"; // Adjust if your path differs

function FormHeader({ title, link, steps = 0, activeStep = 0 }) {
  const location = useLocation();

  return (
    <div className="form-header mb-1">
      <div className="form-inner flex flex-col md:flex-row justify-between items-center w-full">
        {/* Logo */}
        <div className="logo max-w-[120px] mb-3 md:mb-0">
          <Link to="/">
            <img src={logo} alt="BidInsight Logo" className="w-full" />
          </Link>
        </div>

        {/* Header Links */}
        <div className="header-link flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <Link
            to="/login"
            className="text-white text-sm md:text-base hover:underline"
          >
            Need help?
          </Link>
          <Link
            to={link}
            className="text-white text-sm md:text-base hover:underline"
          >
            {title}
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      {steps > 0 && (
        <div className="process-line flex items-center justify-between mt-3 h-7 gap-4 w-full">
          {Array.from({ length: steps }).map((_, index) => (
            <div
              key={index}
              className={`line-items flex-1 h-1 rounded-full transition-all duration-300 ${
                index <= activeStep ? "bg-white" : "bg-[#273BE2]"
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormHeader;  
  git config --global user.email "Manish@digicots.com"
  git config --global user.name "manishadtanii"
