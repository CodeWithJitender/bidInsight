import { Search } from "lucide-react";
import React, { useState } from "react";

const PublishedDateTab = () => {
  const [selectedFilter, setSelectedFilter] = useState("lastLogin");
  const [date, setDate] = useState("");
  const [within, setWithin] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="flex flex-col gap-6">
        {/* Search bar */}
        {/* <div className="flex justify-end mb-8">
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
        </div> */}
        {/* Last Login */}
        <div>
          <label className="font-semibold block  font-inter text-p mb-2">
            Last Login
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="filter"
              value="lastLogin"
              checked={selectedFilter === "lastLogin"}
              onChange={() => setSelectedFilter("lastLogin")}
              className="accent-purple-600"
            />
            <span className="text-[22px] font-inter">07/07/2025</span>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="font-semibold block  font-inter text-p mb-2">
            Date
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="filter"
              value="date"
              checked={selectedFilter === "date"}
              onChange={() => setSelectedFilter("date")}
              className="accent-purple-600 text-[22px]"
            />
            <input
              type="date"
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px]"
              placeholder="DD/MM/YYYY"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Within */}
        <div>
          <label className="font-semibold block  font-inter text-p mb-2">
            Within
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="filter"
              value="within"
              checked={selectedFilter === "within"}
              onChange={() => setSelectedFilter("within")}
              className="accent-purple-600 "
            />
            <select
              className="border border-gray-300 rounded-md font-inter text-xl px-2 py-1  w-[200px]"
              value={within}
              onChange={(e) => setWithin(e.target.value)}
            >
              <option value="">-Select-</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <label className="font-semibold block  font-inter text-p mb-2">
            Timeline
          </label>
          <div className="flex items-start space-x-2 mb-1">
            <input
              type="radio"
              name="filter"
              value="timeline"
              checked={selectedFilter === "timeline"}
              onChange={() => setSelectedFilter("timeline")}
              className="accent-purple-600"
            />
            <div className="">
              <div className="font-inter text-xl text-gray-800 mb-2">
                Starting
              </div>
              <input
                type="date"
                className="border font-inter text-xl border-gray-300 rounded-md px-2 py-1  w-[200px]"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
          </div>
          <div className="ml-6">
            <div className="font-inter text-xl text-gray-800 mb-2">Ending</div>
            {/* <br /> */}
            <input
              type="date"
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px]"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
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

export default PublishedDateTab;
