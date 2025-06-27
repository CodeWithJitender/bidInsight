// import React from "react";
// import { Link } from "react-router-dom";

// function FormFooter({ data }) {
//   const { back, next, skip } = data;
//   return (
//     <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-5">
//       <div className="flex flex-col text-center md:flex-row gap-2 w-full lg:w-auto">
//         {back && (
//           <Link
//           to={back.link}
//           className="rounded-[20px] text-white text-lg p-3 lg:py-4 lg:px-10 font-h border border-white transition-all duration-300"
//         >
//           {back.text}
//         </Link>
//         )}
//         {next && (
//           <Link
//             to={next.link}
//             className="rounded-[20px] bg-[#273BE2] md:ms-5  text-white text-lg p-3 lg:py-4 lg:px-10 font-h border border-[rgba(255,255,255,0.5)] transition-all duration-300"
//           >
//             {next.text}
//           </Link>
//         )}
//       </div>
//      <div className="">
//        {skip && (
//         <Link
//           to={skip.link}
//           className="  text-white text-lg p-3 lg:p-4 font-h transition-all duration-300"
//         >
//           {skip.text}
//         </Link>
//       )}
//      </div>
//     </div>
//   );
// }

// export default FormFooter;









import React from "react";
import { Link } from "react-router-dom";

function FormFooter({ data }) {
  const { back, next, skip } = data;

  return (
    <div className="flex flex-col gap-4 mt-2 w-full">
      {/* Back & Next buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        {/* Buttons container */}
        <div className="flex flex-wrap justify-center md:justify-start gap-9 w-full md:w-auto">
          {back && (
            <Link
              to={back.link}
              className="rounded-[20px] text-white text-lg px-[2.2rem] py-3 font-h border border-white transition-all duration-300 hover:bg-white hover:text-[#273BE2]"
            >
              Already have an account? login
            </Link>
          )}
          {next && (
            <Link
              to={next.link}
              className="rounded-[20px] bg-[#273BE2] text-white text-lg px-14 py-3 font-h transition-all duration-300 hover:bg-[#1e2fb8]"
            >
              {next.text}
            </Link>
          )}
        </div>

    
      </div>
    </div>
  );
}

export default FormFooter;
