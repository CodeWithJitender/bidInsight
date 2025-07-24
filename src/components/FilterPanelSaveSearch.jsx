import React, { useState } from "react";
import SavedSearchForm from "./tabs/SavedSearchForm";
import StatusTab from "./tabs/StatusTab";
import KeywordTab from "./tabs/KeywordTab";
import LocationTab from "./tabs/LocationTab";
import PublishedDateTab from "./tabs/PublishedDateTab";
import ClosingDateTab from "./tabs/ClosingDateTab";
import SolicitationTypeTab from "./tabs/SolicitationTypeTab";
import NAICSCode from "./tabs/NAICSCode";
import UNSPSCCode from "./tabs/UNSPSCCode";
import api from "../utils/axios";
import { parseSavedSearch } from "../utils/parseSavedSearch";
import { useSearchParams } from "react-router-dom";


const tabs = [
  "Save Search Form",
  "Status",
  "NAICSCode",
  "UNSPSCCode",
  "Keyword",
  "Location",
  "Published Date",
  "Closing Date",
  "Solicitation Type",
];

function FilterPanelSaveSearch({
  filters,
  setFilters,
  onClose,
  onSave,
  selectedSearch = "",
  mode = "create",
  savedSearches = [],
  onApply,
}) {
  const [activeTab, setActiveTab] = useState("Save Search Form");
  const [defaultSearch, setDefaultSearch] = useState(false);
  const [searchOption, setSearchOption] = useState(mode);
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(selectedSearch);
  const [showValidation, setShowValidation] = useState(false);
  const [triggerSave, setTriggerSave] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const handleSaveSearchSubmit = (data) => {


    if (!data.name?.trim()) {
      setShowValidation(true);
      return;
    }

    console.log("✅ handleSaveSearchSubmit Final Payload:", {
      name: data.name.trim(),
      isDefault: data.isDefault ?? defaultSearch,
      filters: data.filters ?? filters,
      action: data.action ?? (searchOption === "replace" ? "replace" : "create"),
      id: data.id ?? (searchOption === "replace" ? selectedSavedSearch?.id : undefined),
    });


    onSave?.({
      name: data.name.trim(),
      isDefault: defaultSearch,
      filters: data.filters ?? filters,
      action: searchOption === "replace" ? "replace" : "create",
      id: searchOption === "replace" ? selectedSavedSearch?.id : undefined, // ✅ important
    });

    setShowValidation(false);
    setTriggerSave(false);
    onClose();
  };

  const handleSaveSearchClickFromAnyTab = () => {
    if (!filters.searchName?.trim()) {
      setShowValidation(true);
      setActiveTab("Save Search Form");
    } else {
      setTriggerSave(true);
    }
  };

  const handleClearAll = () => {
    setFilters({
      searchName: "",
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

    setActiveTab("Save Search Form");
    setDefaultSearch(false);
    setSelectedSavedSearch("");
    setSearchOption("create");
    setShowValidation(false);
  };

  // ✅ NEW FUNCTION TO HANDLE REPLACE SELECTION
  const handleSavedSearchSelect = (selected) => {
    // selected should be the full saved search object
    setSelectedSavedSearch(selected);
    setSearchOption("replace");
    setActiveTab("Save Search Form");
  };



  const sharedProps = {
    filters,
    setFilters,
    setActiveTab,
    searchOption,
    setShowValidation,
    setTriggerSave,
    onSaveClick: handleSaveSearchClickFromAnyTab,
    onClose,
    onApply,
    onSubmit: handleSaveSearchSubmit, // <-- Add this line
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Save Search Form":
        return (
          <SavedSearchForm
            {...sharedProps}
            onCancel={onClose}
            onSubmit={handleSaveSearchSubmit}
            defaultSearch={defaultSearch}
            setDefaultSearch={setDefaultSearch}
            selectedSavedSearch={selectedSavedSearch}
            setSelectedSavedSearch={setSelectedSavedSearch}
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            showValidation={showValidation}
            setShowValidation={setShowValidation}
            triggerSave={triggerSave}
            setTriggerSave={setTriggerSave}
            savedFilters={savedSearches}
            onSelectSavedSearch={handleSavedSearchSelect} // ✅ pass here
          />
        );
      case "Status":
        return <StatusTab {...sharedProps}
          key={selectedSavedSearch?.id || 'new'}
          onCancel={onClose}
          onSubmit={handleSaveSearchSubmit}
          defaultSearch={defaultSearch}
          setDefaultSearch={setDefaultSearch}
          selectedSavedSearch={selectedSavedSearch}
          setSelectedSavedSearch={setSelectedSavedSearch}
          searchOption={searchOption}
          setSearchOption={setSearchOption}
          showValidation={showValidation}
          setShowValidation={setShowValidation}
          triggerSave={triggerSave}
          setTriggerSave={setTriggerSave}
          savedFilters={savedSearches}
          onSelectSavedSearch={handleSavedSearchSelect} // ✅ pass here
        />;
      case "NAICSCode":
        return <NAICSCode {...sharedProps} />;
      case "UNSPSCCode":
        return <UNSPSCCode {...sharedProps} />;
      case "Keyword":
        return <KeywordTab
          {...sharedProps}
          defaultSearch={defaultSearch}
          selectedSavedSearch={selectedSavedSearch}
          setDefaultSearch={setDefaultSearch}
          setSelectedSavedSearch={setSelectedSavedSearch}
          searchOption={searchOption}
          setSearchOption={setSearchOption}
          showValidation={showValidation}
          setShowValidation={setShowValidation}
          triggerSave={triggerSave}
          setTriggerSave={setTriggerSave}
          savedFilters={savedSearches}
          onSelectSavedSearch={handleSavedSearchSelect}
        />;
      case "Location":
        return <LocationTab
          {...sharedProps}
          defaultSearch={defaultSearch}
          selectedSavedSearch={selectedSavedSearch}
          setDefaultSearch={setDefaultSearch}
          setSelectedSavedSearch={setSelectedSavedSearch}
          searchOption={searchOption}
          setSearchOption={setSearchOption}
          showValidation={showValidation}
          setShowValidation={setShowValidation}
          triggerSave={triggerSave}
          setTriggerSave={setTriggerSave}
          savedFilters={savedSearches}
          onSelectSavedSearch={handleSavedSearchSelect}
        />;
      case "Published Date":
        return <PublishedDateTab
          {...sharedProps}
          defaultSearch={defaultSearch}
          selectedSavedSearch={selectedSavedSearch}
          setDefaultSearch={setDefaultSearch}
          setSelectedSavedSearch={setSelectedSavedSearch}
          searchOption={searchOption}
          setSearchOption={setSearchOption}
          showValidation={showValidation}
          setShowValidation={setShowValidation}
          triggerSave={triggerSave}
          setTriggerSave={setTriggerSave}
          savedFilters={savedSearches}
          onSelectSavedSearch={handleSavedSearchSelect}
        />;
      case "Closing Date":
        return <ClosingDateTab {...sharedProps} />;
      case "Solicitation Type":
        return <SolicitationTypeTab {...sharedProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-50 flex">
      <div className="w-[30%] bg-blue text-white p-10 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-end mb-8">
            <h1 className="font-archivo font-bold text-h3">Save Search</h1>
            <button onClick={onClose} className="text-p font-inter">
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
          onClick={handleClearAll}
          className="text-p underline font-inter text-right"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 bg-white flex flex-col justify-between w-[70%]">
        <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default FilterPanelSaveSearch;