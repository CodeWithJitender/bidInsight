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
  const handleSavedSearchSelect = async (selected) => {
    console.log("✅ Saved search selected:", selected);

    const token = localStorage.getItem("access_token");

    try {
      const res = await api.get("/bids/saved-filters/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const matched = res.data.find((item) => item.id === parseInt(selected.id));
      if (!matched) return;

      const parsedFilters = parseSavedSearch(matched.query_string); // ✅ convert query string to object

      // ✅ Update filters state
      setFilters(parsedFilters);
      setSelectedSavedSearch({ id: matched.id, name: matched.name });
      setSearchOption("replace");

      // ✅ Update URL params
      const urlParams = new URLSearchParams();

      if (parsedFilters.status) urlParams.set("bid_type", parsedFilters.status);
      if (parsedFilters.keyword) urlParams.set("bid_name", parsedFilters.keyword);
      if (parsedFilters.location) urlParams.set("state", parsedFilters.location);
      if (parsedFilters.publishedDate?.from) urlParams.set("open_date_after", parsedFilters.publishedDate.from);
      if (parsedFilters.publishedDate?.to) urlParams.set("open_date_before", parsedFilters.publishedDate.to);
      if (parsedFilters.closingDate?.from) urlParams.set("close_date_after", parsedFilters.closingDate.from);
      if (parsedFilters.closingDate?.to) urlParams.set("close_date_before", parsedFilters.closingDate.to);
      if (parsedFilters.solicitationType?.length) urlParams.set("solicitation", parsedFilters.solicitationType.join(","));
      if (parsedFilters.naics_codes?.length) urlParams.set("naics_codes", parsedFilters.naics_codes.join(","));
      if (parsedFilters.unspsc_codes?.length) urlParams.set("unspsc_codes", parsedFilters.unspsc_codes.join(","));
      if (parsedFilters.includeKeywords?.length) urlParams.set("include", parsedFilters.includeKeywords.join(","));
      if (parsedFilters.excludeKeywords?.length) urlParams.set("exclude", parsedFilters.excludeKeywords.join(","));

      // ✅ Optional: Reset pagination
      urlParams.set("page", "1");
      urlParams.set("pageSize", "25");

      // ✅ Update URL
      setSearchParams(urlParams);

      // ✅ Trigger API fetch
      setTimeout(() => {
        console.log("🚀 Calling onApply with filters:", parsedFilters);
        onApply?.();
      }, 0);
    } catch (err) {
      console.error("❌ Failed to load saved search", err);
    }


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
        return <KeywordTab {...sharedProps} />;
      case "Location":
        return <LocationTab {...sharedProps} />;
      case "Published Date":
        return <PublishedDateTab {...sharedProps} />;
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