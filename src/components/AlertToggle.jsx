import React, { useState } from "react";

function AlertToggle() {
  // 🔹 Default OFF (false)
  const [active, setActive] = useState(false);

  return (
    <div>
      <div className="on-off-toggle relative cursor-pointer">
        <label
          htmlFor="switch"
          className={`on-off w-[90px] h-[50px] rounded-[32.58px] p-[5px] flex items-center justify-between ${
            active ? "" : "active"
          }`}
        >
          {/* 🔹 Show OFF (gray) when false, ON (blue) when true */}
          <div className="text-center w-[50%] font-medium text-[#999999]">
             ON
          </div>
          <div className="text-center w-[50%] font-medium text-primary ">
            OFF
          </div>

          {/* 🔹 Toggle knob */}
          <span className="slider w-[41px] h-[40px] bg-primary block rounded-[50%] absolute top-[5px] left-[5px] transition-all duration-300"></span>

          {/* 🔹 Controlled checkbox */}
          <input
            type="checkbox"
            id="switch"
            className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
            checked={active}
            onChange={() => setActive((prev) => !prev)}
          />
        </label>
      </div>
    </div>
  );
}

export default AlertToggle;
