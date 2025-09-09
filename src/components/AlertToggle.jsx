import React, { useState } from "react";

function AlertToggle() {
    const [active, setActive] = useState(false)
  return (
    <div>
      {/* <div className="on-off-toggle relative cursor-pointer">
        <label
          className={`on-off w-[90px] h-[50px] rounded-[32.58px] p-[5px] flex items-center justify-content-between ${active !== true?"": "active"}`}
          form="switch"
        >
          <div className="off text-center w-[50%] text-[#999999] font-medium">
            OFF
          </div>
          <div className="on text-center w-[50%] text-primary font-medium">
            ON
          </div>
          <span className="slider w-[41px] h-[40px] bg-primary block rounded-[50%] absolute top-[10]"></span>
          <input
            type="checkbox"
            className="opacity-0 absolute top-0"
            id="switch"
            checked
            onChange={(e)=>setActive((pre)=>(!pre))}
          />
        </label>
      </div> */}
    </div>
  );
}

export default AlertToggle;
