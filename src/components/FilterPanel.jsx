
import React, { useState, useEffect, useRef } from "react";
import { getBids } from "../services/bid.service.js";


import StatusTab from "./tabs/StatusTab";
import CategoriesTab from "./tabs/CategoriesTab";
import KeywordTab from "./tabs/KeywordTab";
import LocationTab from "./tabs/LocationTab";
import PublishedDateTab from "./tabs/PublishedDateTab";
import ClosingDateTab from "./tabs/ClosingDateTab";
import SolicitationTypeTab from "./tabs/SolicitationTypeTab";
import UNSPSCCode from "./tabs/UNSPSCCode";
import NAICSCode from "./tabs/NAICSCode";
import { useNavigate, useLocation } from "react-router-dom";
import { setBids } from "../redux/reducer/bidSlice.js";
import { useDispatch } from "react-redux";
import { buildQueryString } from "../utils/buildQueryString.js";


const tabs = [
  "Status",
  "Keyword",
  "Location",
  "NAICS Code",
  "UNSPSC Code",
  "Published Date",
  "Closing Date",
  "Solicitation Type",
];


const FilterPanel = ({ onClose, filters: propFilters, setFilters: setPropFilters }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  // ✅ Updated filters state with date filters
  const [filters, setFilters] = useState({
    status: "",
    keyword: {
      include: [],
      exclude: [],
    },
    location: [],
    NAICSCode: [],        // ✅ Fixed field name
    UNSPSCCode: [],
    solicitationType: [],
    publishedDate: {      // ✅ Added published date
      type: "",
      within: "",
      date: "",
      from: "",
      to: "",
      after: "",          // ✅ API parameter
      before: ""          // ✅ API parameter
    },
    closingDate: {        // ✅ Added closing date
      type: "",
      within: "",
      date: "",
      from: "",
      to: "",
      after: "",          // ✅ API parameter
      before: ""          // ✅ API parameter
    }
  });


  // Use refs to track previous values and avoid infinite loops
  const prevPropFiltersRef = useRef();
  const hasInitializedFromURL = useRef(false);


  // ✅ Updated decodeUrlToFilters function with date parameters
  const decodeUrlToFilters = (searchParams) => {
    const decodedFilters = {
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
        before: ""
      },
      closingDate: {
        type: "",
        within: "",
        date: "",
        from: "",
        to: "",
        after: "",
        before: ""
      }
    };


    // Decode bid_type to status
    if (searchParams.get('bid_type')) {
      decodedFilters.status = searchParams.get('bid_type');
    }


    // Decode state to location array
    if (searchParams.get('state')) {
      decodedFilters.location = searchParams.get('state').split(',');
    }


    // Decode solicitation to solicitationType array
    if (searchParams.get('solicitation')) {
      decodedFilters.solicitationType = searchParams.get('solicitation').split(',');
    }


    // Decode include keywords
    if (searchParams.get('include')) {
      decodedFilters.keyword.include = searchParams.get('include').split(',');
    }


    // Decode exclude keywords
    if (searchParams.get('exclude')) {
      decodedFilters.keyword.exclude = searchParams.get('exclude').split(',');
    }


    // ✅ Decode naics_codes to NAICSCode array
    if (searchParams.get('naics_codes')) {
      const codes = searchParams.get('naics_codes').split(',');
      decodedFilters.NAICSCode = codes.map(code => ({ code: code }));
    }


    // Decode unspsc_codes to UNSPSCCode array
    if (searchParams.get('unspsc_codes')) {
      const codes = searchParams.get('unspsc_codes').split(',');
      decodedFilters.UNSPSCCode = codes.map(code => ({ code: code }));
    }


    // ✅ Decode published date parameters
    if (searchParams.get('open_date_after') || searchParams.get('open_date_before')) {
      decodedFilters.publishedDate.after = searchParams.get('open_date_after') || "";
      decodedFilters.publishedDate.before = searchParams.get('open_date_before') || "";


      const after = new Date(decodedFilters.publishedDate.after);
      const before = new Date(decodedFilters.publishedDate.before);
      const diffDays = (before - after) / (1000 * 60 * 60 * 24);


      if (decodedFilters.publishedDate.after && decodedFilters.publishedDate.before) {
        if (decodedFilters.publishedDate.after === decodedFilters.publishedDate.before) {
          decodedFilters.publishedDate.type = "date";
          decodedFilters.publishedDate.date = decodedFilters.publishedDate.after;
        } else if ([7, 30, 90].includes(diffDays)) {
          decodedFilters.publishedDate.type = "within";
          decodedFilters.publishedDate.within = String(diffDays);
        } else {
          decodedFilters.publishedDate.type = "timeline";
          decodedFilters.publishedDate.from = decodedFilters.publishedDate.after;
          decodedFilters.publishedDate.to = decodedFilters.publishedDate.before;
        }
      }
    }




    // ✅ Decode closing date parameters
    // ✅ Decode closing date parameters
    if (searchParams.get('closing_date_after') || searchParams.get('closing_date_before')) {
      decodedFilters.closingDate.after = searchParams.get('closing_date_after') || "";
      decodedFilters.closingDate.before = searchParams.get('closing_date_before') || "";


      const after = new Date(decodedFilters.closingDate.after);
      const before = new Date(decodedFilters.closingDate.before);
      const diffDays = (before - after) / (1000 * 60 * 60 * 24);


      if (decodedFilters.closingDate.after && decodedFilters.closingDate.before) {
        if (decodedFilters.closingDate.after === decodedFilters.closingDate.before) {
          decodedFilters.closingDate.type = "date";
          decodedFilters.closingDate.date = decodedFilters.closingDate.after;
        } else if ([7, 30, 90].includes(diffDays)) {
          decodedFilters.closingDate.type = "within";
          decodedFilters.closingDate.within = String(diffDays); // 👈 Set within value
        } else {
          decodedFilters.closingDate.type = "timeline";
          decodedFilters.closingDate.from = decodedFilters.closingDate.after;
          decodedFilters.closingDate.to = decodedFilters.closingDate.before;
        }
      }
    }




    return decodedFilters;
  };


  // ✅ Updated useEffect to check for date parameters too
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);


    // Check if there are any filter parameters in the URL (including date parameters)
    const hasFilterParams = searchParams.get('bid_type') ||
      searchParams.get('state') ||
      searchParams.get('solicitation') ||
      searchParams.get('include') ||
      searchParams.get('exclude') ||
      searchParams.get('naics_codes') ||
      searchParams.get('unspsc_codes') ||
      searchParams.get('open_date_after') ||
      searchParams.get('open_date_before') ||
      searchParams.get('closing_date_after') ||
      searchParams.get('closing_date_before');


    if (hasFilterParams && !hasInitializedFromURL.current) {
      const decodedFilters = decodeUrlToFilters(searchParams);
      setFilters(decodedFilters);
      // Also update parent component's filters if setter is provided
      if (setPropFilters) {
        setPropFilters(decodedFilters);
      }
      hasInitializedFromURL.current = true;
      console.log("Decoded filters from URL:", decodedFilters);
    }
  }, [location.search]);


  // Separate useEffect to handle propFilters updates
  useEffect(() => {
    if (propFilters && !hasInitializedFromURL.current) {
      const propFiltersString = JSON.stringify(propFilters);
      const prevPropFiltersString = JSON.stringify(prevPropFiltersRef.current);


      // Only update if propFilters actually changed and we haven't initialized from URL
      if (propFiltersString !== prevPropFiltersString && Object.keys(propFilters).length > 0) {
        setFilters(propFilters);
        prevPropFiltersRef.current = propFilters;
      }
    }
  }, [propFilters]);


  // Function to update filters in both local state and parent component
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    if (setPropFilters) {
      setPropFilters(newFilters);
    }
  };


  // ✅ Updated clearAllFilters with date filters
  const clearAllFilters = () => {
    const clearedFilters = {
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
        before: ""
      },
      closingDate: {
        type: "",
        within: "",
        date: "",
        from: "",
        to: "",
        after: "",
        before: ""
      }
    };


    updateFilters(clearedFilters);
    // Clean the URL so filters won't come back on refresh
    navigate("/dashboard");
  };


  


  // Handle search functionality
  const handleSearch = async () => {
    try {
      // Build query string from filters
      const queryString = buildQueryString(filters);


      console.log("Search clicked with filters:", filters);
      console.log("Generated query string:", queryString);
      console.log("Full URL would be:", `/bids/?${queryString}`);


      // Make API call to fetch bids with filters
      const bidsData = await getBids(`?${queryString}`);
      console.log("API Response:", bidsData);


      navigate(`/dashboard?${queryString}`);


      dispatch(setBids(bidsData));


      // Close the filter panel after successful search
      onClose();


    } catch (error) {
      console.error("Error fetching filtered bids:", error);
      // You might want to show an error message to the user here
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case "Status":
        return <StatusTab filters={filters} setFilters={updateFilters} />;
      case "NAICS Code":
        return <NAICSCode filters={filters} setFilters={updateFilters} />;
      case "UNSPSC Code":
        return <UNSPSCCode filters={filters} setFilters={updateFilters} />;
      case "Keyword":
        return <KeywordTab filters={filters} setFilters={updateFilters} />;
      case "Location":
        return <LocationTab filters={filters} setFilters={updateFilters} />;
      case "Published Date":
        return <PublishedDateTab filters={filters} setFilters={updateFilters} />;
      case "Closing Date":
        return <ClosingDateTab filters={filters} setFilters={updateFilters} />;
      case "Solicitation Type":
        return <SolicitationTypeTab filters={filters} setFilters={updateFilters} />;
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
                className={`cursor-pointer pt-2 ${activeTab === tab ? "font-bold" : ""
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
              onClick={handleSearch}
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