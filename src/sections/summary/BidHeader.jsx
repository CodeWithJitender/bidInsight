import React from "react";

const BidHeader = ({
  title,
  org,
  location,
  postedDate,
  deadline,
  countdownDays,
  countdownHours,
  countdownMinutes,
  countdownSeconds,
}) => {
  return (
   <div className="">
     <div className="container-fixed">
      <div className="summary flex flex-col md:flex-row justify-between items-center shadow-lg gap-6 md:gap-0">
        {/* Left Section */}
        <div className="w-[70%]">
          <h2 className="text-h3 font-bold font-archivo">{title}</h2>
          <p className="text-[28px] font-normal font-archivo">{org}</p>
          <img src="summary-line.png" className="w-full my-4" alt="" />
          <div className="flex flex-wrap md:flex-nowrap justify-between gap-6 text-sm md:text-base">
            <div className="flex items-center flex-col text-center gap-2">
              <i className="fas text-xl fa-map-marker-alt"></i>
              <div>
                <p className="font-inter text-xl text-[#DBDBDB]">Location</p>
                <p className="font-inter text-p text-white">{location}</p>
              </div>
            </div>
            <div className="flex items-center flex-col text-center gap-2">
              <i class="fas text-xl fa-calendar-alt"></i>
              <div>
                <p className="font-inter text-xl text-[#DBDBDB]">Posted</p>
                <p className="font-inter text-p text-white">{postedDate}</p>
              </div>
            </div>
            <div className="flex items-center flex-col text-center gap-2">
              <i class="fas text-xl fa-history"></i>
              <div>
                <p className="font-inter text-xl text-[#DBDBDB]">Deadline</p>
                <p className="font-inter text-p text-white">{deadline}</p>
              </div>
            </div>
            <div className="flex items-center flex-col text-center gap-2">
              <i class="fas text-xl fa-external-link"></i>
              <div>
                <p className="font-inter text-xl text-[#DBDBDB]">Open Source</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Countdown */}
        <div className="flex flex-col items-center text-center">
          <p className="font-archivo text-white text-p font-bold mb-2">Countdown</p>
          <div className="relative w-40 h-40 mb-3">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                className="text-gray-600"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                r="16"
                cx="18"
                cy="18"
              />
              <circle
                className="text-blue-500"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="transparent"
                r="16"
                cx="18"
                cy="18"
                strokeDasharray="100"
                strokeDashoffset={(100 - (countdownDays / 30) * 100).toFixed(2)}
                transform="rotate(-90 18 18)"
              />
              <text
                x="50%"
                y="46%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-[0.35rem] fill-white font-bold"
              >
                {countdownDays}
              </text>
              <text
                x="50%"
                y="58%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-[0.15rem] fill-white font-inter"
              >
                Days Left
              </text>
            </svg>
          </div>

          <div className="flex gap-4 text-sm">
            <div>
              <p className="font-archivo font-bold text-p xl:text-[28px]">{countdownHours}</p>
              <p className="text-gray-300 font-inter text-xl">Hours</p>
            </div>
            <div>
              <p className="font-archivo font-bold text-p xl:text-[28px]">{countdownMinutes}</p>
              <p className="text-gray-300 font-inter text-xl">Minutes</p>
            </div>
            <div>
              <p className="font-archivo font-bold text-p xl:text-[28px]">{countdownSeconds}</p>
              <p className="text-gray-300 font-inter text-xl">Seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
   </div>
  );
};

export default BidHeader;
