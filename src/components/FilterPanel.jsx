import React, { useState } from "react";

import StatusTab from "./tabs/StatusTab";
import CategoriesTab from "./tabs/CategoriesTab";
import KeywordTab from "./tabs/KeywordTab";
import LocationTab from "./tabs/LocationTab";
import PublishedDateTab from "./tabs/PublishedDateTab";
import ClosingDateTab from "./tabs/ClosingDateTab";
import SolicitationTypeTab from "./tabs/SolicitationTypeTab";
import UNSPSCCode from "./tabs/UNSPSCCode";
import NAICSCode from "./tabs/NAICSCode";

const tabs = [
  "Status",
  "Keyword",
  "Location",
  "NAICS Code",
  "UNSPSC Code",
  // "Include Keywords",
  // "Exclude Keywords",
  "Published Date",
  "Closing Date",
  "Solicitation Type",
];

const FilterPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [filters, setFilters] = useState({
    status:"",
    keyword:{
      include: [],
      exclude: [],
    },
    location:[],
    // NAICSCode:[],
    UNSPSCCode:[],
    solicitationType:[],
  });

  const clearAllFilters = () => {
    setFilters({
      status: "",
      keyword: {
        include: [],
        exclude: [],
      },
      location: [],
      UNSPSCCode: [],
      solicitationType: [],
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Status":
        return <StatusTab filters={filters} setFilters={setFilters} />;
      case "NAICS Code":
        return <NAICSCode filters={filters} setFilters={setFilters} />;
      case "UNSPSC Code":
        return <UNSPSCCode filters={filters} setFilters={setFilters} />;
      case "Keyword":
        return <KeywordTab filters={filters} setFilters={setFilters} />;
      // case "Include Keywords":
      //   return <KeywordTab filters={filters} setFilters={setFilters} mode="include" />;
      // case "Exclude Keywords":
      //   return <KeywordTab filters={filters} setFilters={setFilters} mode="exclude" />;
      case "Location":
        return <LocationTab filters={filters} setFilters={setFilters} />;
      case "Published Date":
        return <PublishedDateTab filters={filters} setFilters={setFilters} />;
      case "Closing Date":
        return <ClosingDateTab filters={filters} setFilters={setFilters} />;
      case "Solicitation Type":
        return <SolicitationTypeTab filters={filters} setFilters={setFilters} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[500] flex">
      {/* Sidebar */}
      <div className="w-[30%] bg-blue text-white p-10 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-end mb-8">
            <h1 className="font-archivo font-bold text-h3">Filter</h1>
            <button className="text-p font-inter" onClick={onClose}>
              Close ✕
            </button>
          </div>

          <ul className="space-y-4">
            {tabs.map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer pt-2 ${
                  activeTab === tab ? "font-bold" : ""
                }`}
              >
                <div className="flex justify-between items-center font-inter text-p font-medium">
                  <span>{tab}</span>
                  <span>{activeTab === tab ? "−" : "+"}</span>
                </div>
                <img src="line.png" className="mt-3" alt="divider" />
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={clearAllFilters}
          className="text-p underline font-inter text-right"
        >
          Clear All
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white flex flex-col justify-between w-[70%]">
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
          {/* Sticky Bottom Buttons */}
          <div className="flex gap-4 p-5 px-10 bg-white sticky bottom-0">
            <button
              onClick={onClose}
              className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log("Search clicked with filters:", filters);
                // Handle search logic here
                onClose();
              }}
              className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
