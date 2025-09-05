import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";

export default function CustomTooltip({ title }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <FiInfo className="text-gray-400 cursor-pointer font-inter" />

      {show && (
        <div className="absolute left-6 top-0 bg-[#9999994D] text-[#4A4A4A] text-xs rounded-md px-3 py-2 w-64 shadow-lg z-10">
          {title}
        </div>
      )}
    </div>
  );
}
