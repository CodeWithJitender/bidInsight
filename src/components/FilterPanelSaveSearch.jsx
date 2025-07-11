import React, { useState } from "react";
import SaveSearchForm from "./tabs/SaveSearchForm";
import StatusTab from "./tabs/StatusTab";
import CategoriesTab from "./tabs/CategoriesTab";
import KeywordTab from "./tabs/KeywordTab";
import LocationTab from "./tabs/LocationTab";
import PublishedDateTab from "./tabs/PublishedDateTab";
import ClosingDateTab from "./tabs/ClosingDateTab";
import SolicitationTypeTab from "./tabs/SolicitationTypeTab";

// Dummy components for tabs — replace with your real ones
// const StatusTab = () => <div className="p-6">Status Content</div>;
// const CategoriesTab = () => <div className="p-6">Categories Content</div>;
// const KeywordTab = () => <div className="p-6">Keyword Content</div>;
// const LocationTab = () => <div className="p-6">Location Content</div>;
// const PublishedDateTab = () => (
//   <div className="p-6">Published Date Content</div>
// );
// const ClosingDateTab = () => <div className="p-6">Closing Date Content</div>;
// const SolicitationTypeTab = () => (
//   <div className="p-6">Solicitation Type Content</div>
// );

const tabs = [
  "SaveSearchForm",
  "Status",
  "Categories",
  "Keyword",
  "Location",
  "Published Date",
  "Closing Date",
  "Solicitation Type",
];

function FilterPanelSaveSearch({ onClose }) {
  const [activeTab, setActiveTab] = useState("SaveSearchForm");

  const renderTabContent = () => {
    switch (activeTab) {
      case "SaveSearchForm":
        return <SaveSearchForm />;
      case "Status":
        return <StatusTab />;
      case "Categories":
        return <CategoriesTab />;
      case "Keyword":
        return <KeywordTab />;
      case "Location":
        return <LocationTab />;
      case "Published Date":
        return <PublishedDateTab />;
      case "Closing Date":
        return <ClosingDateTab />;
      case "Solicitation Type":
        return <SolicitationTypeTab />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-screen z-50 flex">
      {/* Sidebar */}
      <div className="w-[30%] bg-blue text-white p-10 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-end mb-8">
            <h1 className="font-archivo font-bold text-h3">Filter</h1>
            <button onClick={onClose} className="text-p font-inter ">
              Close ✕
            </button>
          </div>
          <ul className="space-y-4">
            {tabs.map((tab) => (
              <li
                key={tab}
                className="cursor-pointer pt-2"
                onClick={() => setActiveTab(tab)}
              >
                <div className="flex justify-between items-center font-inter text-p font-medium">
                  <span>{tab}</span>
                  <span>{activeTab === tab ? "−" : "+"}</span>
                </div>
                <img src="line.png" className="mt-3" alt="" />
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => setActiveTab(null)}
          className="text-p underline font-inter text-right"
        >
          Clear All
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-white flex flex-col justify-between w-[70%]">
        <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default FilterPanelSaveSearch;
