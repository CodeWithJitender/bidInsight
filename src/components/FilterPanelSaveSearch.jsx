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
import { Save } from "lucide-react";
import SavedSearchForm from "./tabs/SavedSearchForm";
import { buildQueryString } from "../utils/buildQueryString";
import { createSavedSearch, getSavedSearches } from "../services/bid.service";
import { addSavedSearch } from "../redux/reducer/savedSearchesSlice";
import { useDispatch } from "react-redux";

const tabs = [
  "Saved Searches",
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

const FilterPanelSaveSearch = ({ onClose, selectedSearch }) => {
  console.log(selectedSearch);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  // ✅ Updated filters state with date filters
  const [filters, setFilters] = useState({
    status: "",
    keyword: {
      include: [],
      exclude: [],
    },
    location: [],
    NAICSCode: [], // ✅ Fixed field name
    UNSPSCCode: [],
    solicitationType: [],
    publishedDate: {
      // ✅ Added published date
      type: "",
      within: "",
      date: "",
      from: "",
      to: "",
      after: "", // ✅ API parameter
      before: "", // ✅ API parameter
    },
    closingDate: {
      // ✅ Added closing date
      type: "",
      within: "",
      date: "",
      from: "",
      to: "",
      after: "", // ✅ API parameter
      before: "", // ✅ API parameter
    },
  });

  const [savedSearch, setSavedSearch] = useState({
    name: "",
    query_string: "",
  });

  const dispatch = useDispatch();

  const handleSaveSearch = async (e) => {
    try {
      e.preventDefault();
      const queryString = buildQueryString(filters);
      setSavedSearch((prev) => ({
        ...prev,
        query_string: `?${queryString}`,
      }));

      const savedSearchData = {
        name: savedSearch.name,
        query_string: `?${queryString}`,
      };

      const response = await createSavedSearch(savedSearchData);
      if (response) {
        alert("Saved Search created successfully!");
        console.log("Saved Search:", savedSearchData);
      }
    } catch (error) {
      console.error("Error saving search:", error);
    } finally {
      // Reset savedSearch state after saving
      setSavedSearch({
        name: "",
        query_string: "",
      });
      // Reset filters state to default
      setFilters({
        status: "",
        keyword: {
          include: [],
          exclude: [],
        },
        location: [],
        NAICSCode: [],
        UNSPSCCode: [],
        solicitationType: [],
        publishedDate: {
          type: "",
          within: "",
          date: "",
          from: "",
          to: "",
          after: "",
          before: "",
        },
        closingDate: {
          type: "",
          within: "",
          date: "",
          from: "",
          to: "",
          after: "",
          before: "",
        },
      });
      const res = await getSavedSearches();
      // console.log(res);
      dispatch(addSavedSearch(res));

      // Optionally, close the filter panel
      onClose();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Saved Searches":
        return (
          <SavedSearchForm
            selectedSearch={selectedSearch}
            savedSearch={savedSearch}
            setSavedSearch={setSavedSearch}
            setFilters={setFilters}
            filters={filters}
          />
        );
      case "Status":
        return <StatusTab filters={filters} setFilters={setFilters} />;
      case "NAICS Code":
        return <NAICSCode filters={filters} setFilters={setFilters} />;
      case "UNSPSC Code":
        return <UNSPSCCode filters={filters} setFilters={setFilters} />;
      case "Keyword":
        return <KeywordTab filters={filters} setFilters={setFilters} />;
      case "Location":
        return <LocationTab filters={filters} setFilters={setFilters} />;
      case "Published Date":
        return <PublishedDateTab filters={filters} setFilters={setFilters} />;
      case "Closing Date":
        return <ClosingDateTab filters={filters} setFilters={setFilters} />;
      case "Solicitation Type":
        return (
          <SolicitationTypeTab filters={filters} setFilters={setFilters} />
        );
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

        <button className="text-p underline font-inter text-right">
          Clear All
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white flex flex-col justify-between w-[70%]">
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
          {/* Footer buttons */}
          <div className="flex gap-4 p-5 bg-white sticky bottom-0">
            <button
              type="button"
              className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
              onClick={() => alert("Cancel clicked (Dummy)")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
              onClick={(e) => {
                e.preventDefault();
                // console.log(filters);
                handleSaveSearch(e);
                // alert("Save clicked (Dummy)");
              }}
            >
              Save Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelSaveSearch;
