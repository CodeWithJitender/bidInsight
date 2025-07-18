import React, { useState, useEffect } from "react";

import StatusTab from './tabs/StatusTab';
import CategoriesTab from './tabs/CategoriesTab';
import KeywordTab from './tabs/KeywordTab';
import LocationTab from './tabs/LocationTab';
import PublishedDateTab from './tabs/PublishedDateTab';
import ClosingDateTab from './tabs/ClosingDateTab';
import SolicitationTypeTab from './tabs/SolicitationTypeTab';
import UNSPSCCode from "./tabs/UNSPSCCode";
import NAICSCode from "./tabs/NAICSCode";

const tabs = [
  "Status",
  "NAICSCode",
  "UNSPSCCode",
  "Keyword",
  // "Include Keywords",
  // "Exclude Keywords",
  "Location",
  "Published Date",
  "Closing Date",
  "Solicitation Type",
];

function FilterPanel({ filters, setFilters, onClose }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("lastActiveFilterTab") || "Status";
  });

  useEffect(() => {
    localStorage.setItem("lastActiveFilterTab", activeTab);
  }, [activeTab]);

  const commonProps = {
    filters,
    setFilters,
    onApply: onClose,
    searchOption: "filter",
    setShowValidation: () => {},
    setTriggerSave: () => {},
    setActiveTab,
  };

  const clearAllFilters = () => {
    setFilters({
      status: "",
      categories: [],
      keyword: "",
      location: "",
      publishedDate: { from: "", to: "" },
      closingDate: { from: "", to: "" },
      solicitationType: [],
      naics_codes: [],
      unspsc_codes: [],
      includeKeywords: [],
      excludeKeywords: [],
    });
    setActiveTab("Status");
    localStorage.setItem("lastActiveFilterTab", "Status");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Status":
        return <StatusTab {...commonProps} />;
      case "NAICSCode":
        return <NAICSCode {...commonProps} />;
      case "UNSPSCCode":
        return <UNSPSCCode {...commonProps} />;
      case "Keyword":
        return <KeywordTab {...commonProps} mode="keyword" />;
      case "Include Keywords":
        return <KeywordTab {...commonProps} mode="include" />;
      case "Exclude Keywords":
        return <KeywordTab {...commonProps} mode="exclude" />;
      case "Location":
        return <LocationTab {...commonProps} />;
      case "Published Date":
        return <PublishedDateTab {...commonProps} />;
      case "Closing Date":
        return <ClosingDateTab {...commonProps} />;
      case "Solicitation Type":
        return <SolicitationTypeTab {...commonProps} />;
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
            <button onClick={onClose} className="text-p font-inter">
              Close ✕
            </button>
          </div>

          <ul className="space-y-4">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`cursor-pointer pt-2 ${activeTab === tab ? "font-bold" : ""}`}
                onClick={() => setActiveTab(tab)}
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
        <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default FilterPanel;
