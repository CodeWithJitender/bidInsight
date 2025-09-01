// import React from "react";
// import { Link } from "react-router-dom";

// function FormFooter({ data, onNextClick, onSkipClick }) {
//   const { back, next, skip } = data;

//   return (
//     <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-5 mb-3">
//       <div className="flex flex-col text-center md:flex-row gap-2 w-full lg:w-auto">
//         {back && (
//           <Link
//             to={back.link}
//             className="rounded-[20px] text-white text-lg p-3 lg:py-4 lg:px-10 font-h border border-white transition-all duration-300"
//           >
//             {back.text}
//           </Link>
//         )}
//         {next && (
//           <button
//             className="rounded-[20px] bg-[#273BE2] md:ms-5 text-white text-lg p-3 lg:py-4 lg:px-10 font-h border border-[rgba(255,255,255,0.5)] transition-all duration-300"
//             type="submit"
//             onClick={onNextClick}
//           >
//             {next.text}
//           </button>
//         )}
//       </div>
//       <div className="">
//         {skip && (
//           <Link
//             to={skip.link}
//             className="text-white text-lg p-3 lg:p-4 font-h transition-all duration-300"
//              onClick={onSkipClick}
//           >
//             {skip.text}
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

// export default FormFooter;











import React from "react";
import { Link, useNavigate } from "react-router-dom";

function FormFooter({ data, onNextClick, onSkipClick }) {
  const { back, next, skip } = data;
  const navigate = useNavigate();

  const handleSkip = (e) => {
    e.preventDefault(); // prevent default link navigation
    if (onSkipClick) {
      onSkipClick(); // call custom logic
    }
    navigate(skip.link); // then navigate manually
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-5 mb-3">
      <div className="flex flex-col text-center md:flex-row gap-2 w-full lg:w-auto">
        {back && (
          <Link
            to={back.link}
            className="rounded-[20px] text-white text-lg p-3 lg:py-4 lg:px-10 font-h border border-white transition-all duration-300"
          >
            {back.text}
          </Link>
        )}
        {next && (
          <button
            className="rounded-[20px] bg-[#273BE2]  text-white text-lg p-3 lg:py-4 lg:px-10 font-h border border-[rgba(255,255,255,0.5)] transition-all duration-300"
            type="submit"
            onClick={onNextClick}
          >
            {next.text}
          </button>
        )}
      </div>
      <div className="">
        {skip && (
          <a
            href={skip.link}
            onClick={handleSkip}
            className="text-white text-lg p-3 lg:p-4 font-h transition-all duration-300 cursor-pointer"
          >
            {skip.text}
          </a>
        )}
      </div>
    </div>
  );
}

export default FormFooter;

