import { Search } from "lucide-react";
import React, { useState } from "react";

const bidOptions = [
  "A - Award Notice",
  "AFB - Advertisement for Bid (Informal)",
  "APM - Alternative Procurement Method (Formal)",
  "CBR - Construction Bid Request (Formal)",
  "CC/RFP - Competitive Contract/Request for Proposal (Informal)",
  "CMR - Construction Manager (Informal)",
  "CPR - Construction Proposal Request (Formal)",
  "CSB - Competitive Sealed Bid (Formal)",
  "CFB - Call for Bids",
  "CMR - Construction Manager (Formal)",
];

const SolicitationTypeTab = () => {
  const [selected, setSelected] = useState([]);

  const toggleItem = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const isAllSelected = selected.length === bidOptions.length;

  const toggleAll = () => {
    setSelected(isAllSelected ? [] : [...bidOptions]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      <div className="">
        {/* Search bar */}
        <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search titles or organization or location"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
              size={18}
            />
          </div>
        </div>

        {/* Bid Types Box */}
        <div className=" border-[#273BE280] border-[2px] rounded-[10px]">
          <div className="flex justify-between items-center px-4 py-3 border-b border-[#273BE280]">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="accent-[#273BE280]"
                checked={isAllSelected}
                onChange={toggleAll}
              />
              <span className="text-p font-medium font-inter">Bid Types</span>
            </div>
            <button
              onClick={() => setSelected([])}
              className="text-xl underline"
            >
              Clear All
            </button>
          </div>

          {/* Bid Type Items */}
          <div className="divide-y divide-[#273BE280]">
            {bidOptions.map((item) => (
              <label
                key={item}
                className="flex items-center px-4 py-2 cursor-pointer text-[22px] font-inter"
              >
                <input
                  type="checkbox"
                  className="accent-[#273BE280] mr-3"
                  checked={selected.includes(item)}
                  onChange={() => toggleItem(item)}
                />
                <span className="text-sm text-gray-800">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 p-5 ps-0 bg-white sticky bottom-0">
        <button className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all">
          Cancel
        </button>
        <button className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all">
          Search
        </button>
      </div>
    </div>
  );
};

export default SolicitationTypeTab;
