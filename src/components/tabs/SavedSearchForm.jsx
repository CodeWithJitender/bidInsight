import React, { useState } from "react";
import { useSelector } from "react-redux";

const SavedSearchForm = ({ savedSearch, setSavedSearch, selectedSearch, filters, setFilters }) => {
  const [searchOption, setSearchOption] = useState(selectedSearch ? "replace" : "create"); // "create" | "replace"
  const [searchName, setSearchName] = useState(""); // dummy input value
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(selectedSearch?.id || ""); // dropdown - set to selected search ID
  const [defaultSearch, setDefaultSearch] = useState(false); // checkbox
  const { savedSearches } = useSelector((state) => state.savedSearches);

  console.log(selectedSavedSearch);
  console.log(savedSearches);

  // Function to decode query string and update filters
  const decodeQueryStringToFilters = (queryString) => {
    // Remove the "?" prefix if present
    const cleanQueryString = queryString.startsWith('?') ? queryString.substring(1) : queryString;
    const searchParams = new URLSearchParams(cleanQueryString);

    const decodedFilters = {
      status: "",
      keyword: {
        include: [],
        exclude: [],
      },
      location: [],
      UNSPSCCode: [],
      solicitationType: [],
      NAICSCode: [],
      publishedDate: {},
      closingDate: {},
    };

    if (searchParams.get("bid_type")) {
      decodedFilters.status = searchParams.get("bid_type");
    }

    if (searchParams.get("state")) {
      decodedFilters.location = searchParams.get("state").split(",");
    }

    if (searchParams.get("solicitation")) {
      decodedFilters.solicitationType = searchParams.get("solicitation").split(",");
    }

    if (searchParams.get("include")) {
      decodedFilters.keyword.include = searchParams.get("include").split(",");
    }

    if (searchParams.get("exclude")) {
      decodedFilters.keyword.exclude = searchParams.get("exclude").split(",");
    }

    if (searchParams.get("unspsc_codes")) {
      const codes = searchParams.get("unspsc_codes").split(",");
      decodedFilters.UNSPSCCode = codes.map((code) => ({ code }));
    }

    if (searchParams.get("naics_codes")) {
      const codes = searchParams.get("naics_codes").split(",");
      decodedFilters.NAICSCode = codes.map((code) => ({ code }));
    }

    if (searchParams.get("open_date_after")) {
      decodedFilters.publishedDate.after = searchParams.get("open_date_after");
    }

    if (searchParams.get("open_date_before")) {
      decodedFilters.publishedDate.before = searchParams.get("open_date_before");
    }

    if (searchParams.get("closing_date_after")) {
      decodedFilters.closingDate.after = searchParams.get("closing_date_after");
    }

    if (searchParams.get("closing_date_before")) {
      decodedFilters.closingDate.before = searchParams.get("closing_date_before");
    }

    return decodedFilters;
  };


  
  // Set initial values based on selectedSearch
  React.useEffect(() => {
    if (selectedSearch) {
      setSearchOption("replace");
      setSelectedSavedSearch(selectedSearch.id);
      setSearchName(selectedSearch.name);
      
      // Find the saved search object and decode its query string to set filters
      const savedSearchObj = savedSearches.find(search => search.id === selectedSearch.id);
      if (savedSearchObj && savedSearchObj.query_string) {
        const decodedFilters = decodeQueryStringToFilters(savedSearchObj.query_string);
        setFilters(decodedFilters);
        console.log("🎯 Decoded filters from saved search:", decodedFilters);
      }
    }
  }, [selectedSearch, savedSearches, setFilters]);


  const handleOnChangeInput = (e) => {
    const { name, value } = e.target;
    setSearchName(value);
    setSavedSearch((prev) => ({
      ...prev,
      [name]: value,
      id: searchOption === "replace" ? selectedSavedSearch : null, // Include ID for replace mode
    }));
  };

  // console.log(savedSearch);

  return (
    <form className="min-h-screen flex flex-col justify-between p-10 bg-white">
      <div>
        <h2 className="font-medium mb-4 font-inter text-p">Search</h2>

        {/* Radio buttons */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="searchOption"
              value="create"
              className="accent-blue-600"
              checked={searchOption === "create"}
              onChange={() => setSearchOption("create")}
            />
            <span className="font-inter text-[22px]">Create a new saved search</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="searchOption"
              value="replace"
              className="accent-blue-600"
              checked={searchOption === "replace"}
              onChange={() => setSearchOption("replace")}
            />
            <span className="font-inter text-[22px]">Replace an existing saved search</span>
          </label>
        </div>

        {/* Conditional rendering */}
        {searchOption === "create" ? (
          <>
            <label className="block font-medium mb-4 font-inter text-p mt-8">Search Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter search name"
              className="border border-[#273BE280] rounded-lg px-4 py-2 font-inter text-xl"
              value={searchName}
              onChange={(e) => handleOnChangeInput(e)}
            />
          </>
        ) : (
          <div className="form-group mt-8">
            <label className="font-medium mb-4 font-inter text-p block">
              Replace an existing saved search
            </label>
            <select
              className="form-control border border-primary rounded-lg px-4 py-2 font-inter text-xl"
              value={selectedSavedSearch}
              onChange={(e) => {
                setSelectedSavedSearch(e.target.value);
                // Update the search name when a saved search is selected
                const selected = savedSearches.find(search => search.id === parseInt(e.target.value));
                if (selected) {
                  setSearchName(selected.name);
                  // Decode the query string and update filters
                  const decodedFilters = decodeQueryStringToFilters(selected.query_string);
                  setFilters(decodedFilters);
                  console.log("🔄 Updated filters from selected saved search:", decodedFilters);
                }
              }}
            >
              <option value="">Select saved search</option>
              {savedSearches.map((search) => (
                <option key={search.id} value={search.id}>
                  {search.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Checkbox */}
        <div className="mt-6 flex items-center space-x-2">
          <input
            type="checkbox"
            id="defaultSearch"
            className="accent-primary"
            checked={defaultSearch}
            onChange={() => setDefaultSearch(!defaultSearch)}
          />
          <label htmlFor="defaultSearch" className="font-inter text-[22px] cursor-pointer">
            Set as Default Search
          </label>
        </div>
      </div>

      
    </form>
  );
};

export default SavedSearchForm;