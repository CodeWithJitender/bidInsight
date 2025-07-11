import React, { useState } from "react";
import { Search } from "lucide-react"; // Icon for search

function StatusTab() {
  const [selectedSolicitation, setSelectedSolicitation] = useState(
    "Closed Solicitations"
  );
  const [personalised, setPersonalised] = useState("");

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

        {/* Radio Options */}
        <div className="space-y-6">
          <div>
            <h2 className="text-p font-inter  font-medium mb-2">
              Solicitations
            </h2>
            <div className="space-y-3">
              {[
                "Open Solicitations",
                "Closed Solicitations",
                "Awarded Solicitations",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="solicitation"
                    checked={selectedSolicitation === option}
                    onChange={() => setSelectedSolicitation(option)}
                    className="accent-purple-600"
                  />
                  <span className="font-inter text-xl">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-p font-inter  font-medium mb-2">
              Personalised
            </h2>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="personalised"
                checked={personalised === "My Invitations Only"}
                onChange={() => setPersonalised("My Invitations Only")}
                className="accent-purple-600"
              />
              <span className="font-inter text-xl">My Invitations Only</span>
            </label>
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
}

export default StatusTab;
