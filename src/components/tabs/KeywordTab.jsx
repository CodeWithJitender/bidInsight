import React, { useState } from "react";
import { Search } from "lucide-react"; // Icon for search
import TagInput from "./TagInput"; // Icon for search

function KeywordTab() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="">
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

        {/* Exclude */}
        <div className="mb-6">
          <h3 className="font-semibold block  font-inter text-p mb-4">
            Include
          </h3>
          <TagInput
            placeholder="Add keywords…"
            defaultTags={["Member Agency Bids", "State & Local Bids"]}
          />
        </div>
        {/* Exclude */}
        <div className="mb-6">
          <h3 className="font-semibold block  font-inter text-p mb-4">
            Exclude
          </h3>
          <TagInput
            placeholder="Add keywords…"
            defaultTags={["Member Agency Bids", "State & Local Bids"]}
          />
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
}

export default KeywordTab;
