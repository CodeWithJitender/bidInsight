  // import React, { useEffect, useState } from "react";
  // import { useSelector } from "react-redux";

  // const SavedSearchForm = ({
  //   // ✅ NEW: Props coming from parent (FilterPanelSaveSearch)
  //   searchOption,
  //   setSearchOption,
  //   selectedSavedSearch,
  //   setSelectedSavedSearch,
  //   defaultSearch,
  //   setDefaultSearch,
  //   searchName,
  //    setSearchName,
    
  //   // ✅ EXISTING: Original props
  //   savedSearch,
  //   setSavedSearch,
  //   selectedSearch,
  //   filters,
  //   setFilters,
  //   showValidation,
  //   errors,
  //   setErrors
  // }) => {
  //   // ✅ KEEP: Only searchName as local state

  //   const { savedSearches } = useSelector((state) => state.savedSearches);

  //   const decodeQueryStringToFilters = (queryString) => {
  //     const clean = queryString.startsWith("?") ? queryString.substring(1) : queryString;
  //     const params = new URLSearchParams(clean);

  //     const filters = {
  //       status: "",
  //       keyword: { include: [], exclude: [] },
  //       location: [],
  //       UNSPSCCode: [],
  //       solicitationType: [],
  //       NAICSCode: [],
  //       publishedDate: {},
  //       closingDate: {},
  //     };

  //     if (params.get("bid_type")) filters.status = params.get("bid_type");
  //     if (params.get("state")) filters.location = params.get("state").split(",");
  //     if (params.get("solicitation")) filters.solicitationType = params.get("solicitation").split(",");
  //     if (params.get("include")) filters.keyword.include = params.get("include").split(",");
  //     if (params.get("exclude")) filters.keyword.exclude = params.get("exclude").split(",");
  //     if (params.get("unspsc_codes")) filters.UNSPSCCode = params.get("unspsc_codes").split(",").map((code) => ({ code }));
  //     if (params.get("naics_codes")) filters.NAICSCode = params.get("naics_codes").split(",").map((code) => ({ code }));
  //     if (params.get("open_date_after")) filters.publishedDate.after = params.get("open_date_after");
  //     if (params.get("open_date_before")) filters.publishedDate.before = params.get("open_date_before");
  //     if (params.get("closing_date_after")) filters.closingDate.after = params.get("closing_date_after");
  //     if (params.get("closing_date_before")) filters.closingDate.before = params.get("closing_date_before");

  //     return filters;
  //   };

  //   // ✅ UPDATED: useEffect now only handles searchName and doesn't manage radio states
  //   useEffect(() => {
  //     if (selectedSearch) {
  //       setSearchName(selectedSearch.name);
  //       setSavedSearch((prev) => ({
  //         ...prev,
  //         name: selectedSearch.name,
  //         id: selectedSearch.id,
  //       }));

  //       const savedSearchObj = savedSearches.find((s) => s.id === selectedSearch.id);
  //       if (savedSearchObj?.query_string) {
  //         setFilters(decodeQueryStringToFilters(savedSearchObj.query_string));
  //       }
  //     }
  //   }, [selectedSearch, savedSearches, setFilters, setSavedSearch]);

  //   // ✅ NEW: Handler for Create radio button
  //   const handleCreateOption = () => {
  //     setSearchOption("create");
  //     setSelectedSavedSearch("");
  //     setSearchName("");
  //     setSavedSearch(prev => ({ 
  //       ...prev, 
  //       name: "", 
  //       id: null 
  //     }));
  //     setErrors({ name: "" });
  //   };

  //   // ✅ NEW: Handler for Replace radio button
  //   const handleReplaceOption = () => {
  //     setSearchOption("replace");
  //     setSearchName("");
  //     setSelectedSavedSearch("");
  //     setSavedSearch(prev => ({ 
  //       ...prev, 
  //       name: "", 
  //       id: null 
  //     }));
  //     setErrors({ name: "" });
  //   };

  //   // ✅ IMPROVED: Enhanced input validation (without length check)
  //   const handleOnChangeInput = (e) => {
  //     const { value } = e.target;
  //     const trimmed = value.trim();
  //     setSearchName(value);

  //     // ✅ Real-time validation (no length validation as requested)
  //     if (!trimmed) {
  //       setErrors({ name: "This field is required" });
  //     } else if (
  //       searchOption === "create" &&
  //       savedSearches.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
  //     ) {
  //       setErrors({ name: "Search name already exists" });
  //     } else {
  //       setErrors({ name: "" });
  //     }

  //     setSavedSearch((prev) => ({
  //       ...prev,
  //       name: value,
  //       id: searchOption === "replace" ? selectedSavedSearch : null,
  //     }));
  //   };

  //   // ✅ IMPROVED: Enhanced dropdown validation
  //   const handleDropdownChange = (e) => {
  //     const id = parseInt(e.target.value);
  //     setSelectedSavedSearch(id);
      
  //     if (!id) {
  //       setErrors({ name: "Please select a saved search to replace" });
  //       setSearchName("");
  //       setSavedSearch(prev => ({ 
  //         ...prev, 
  //         name: "", 
  //         id: null 
  //       }));
  //       return;
  //     }
      
  //     const selected = savedSearches.find((s) => s.id === id);
  //     if (selected) {
  //       setSearchName(selected.name);
  //       setSavedSearch((prev) => ({
  //         ...prev,
  //         name: selected.name,
  //         id,
  //       }));
  //       if (selected.query_string) {
  //         setFilters(decodeQueryStringToFilters(selected.query_string));
  //       }
  //       setErrors({ name: "" }); // Clear errors when valid selection made
  //     }
  //   };

  //   return (
  //     <form className="min-h-screen flex flex-col justify-between p-10 bg-white">
  //       <div>
  //         <h2 className="font-medium mb-4 font-inter text-p">Search</h2>

  //         {/* Radio Buttons */}
  //         <div className="space-y-2">
  //           <label className="flex items-center space-x-2 cursor-pointer">
  //             <input
  //               type="radio"
  //               name="searchOption"
  //               value="create"
  //               className="accent-blue-600"
  //               checked={searchOption === "create"}
  //               onChange={handleCreateOption}
  //             />
  //             <span className="font-inter text-[22px]">Create a new saved search</span>
  //           </label>

  //           <label className="flex items-center space-x-2 cursor-pointer">
  //             <input
  //               type="radio"
  //               name="searchOption"
  //               value="replace"
  //               className="accent-blue-600"
  //               checked={searchOption === "replace"}
  //               onChange={handleReplaceOption}
  //             />
  //             <span className="font-inter text-[22px]">Replace an existing saved search</span>
  //           </label>
  //         </div>

  //         {/* Input Field for Create Option */}
  //         {searchOption === "create" ? (
  //           <div className="mt-8">
  //             <label className="block font-medium mb-2 font-inter text-p">Search Name</label>
  //             <input
  //               type="text"
  //               name="name"
  //               placeholder="Enter search name"
  //               className={`border rounded-lg px-4 py-2 font-inter text-xl w-[300px]
  //                 ${showValidation && errors.name ? "border-red-500" : "border-[#273BE280]"}`}
  //               value={searchName}
  //               onChange={handleOnChangeInput}
  //               onBlur={handleOnChangeInput}
  //             />

  //             {/* ✅ Show validation errors */}
  //             {showValidation && errors.name && (
  //               <p className="text-red-600 font-semibold text-sm mt-1">{errors.name}</p>
  //             )}
  //           </div>
  //         ) : (
  //           /* Dropdown for Replace Option */
  //           <div className="form-group mt-8">
  //             <label className="font-medium mb-2 font-inter text-p block">
  //               Replace an existing saved search
  //             </label>
  //             <select
  //               className={`form-control border rounded-lg px-4 py-2 font-inter text-xl w-[300px]
  //                 ${showValidation && errors.name ? "border-red-500" : "border-primary"}`}
  //               value={selectedSavedSearch}
  //               onChange={handleDropdownChange}
  //             >
  //               <option value="">Select saved search</option>
  //               {savedSearches.map((search) => (
  //                 <option key={search.id} value={search.id}>
  //                   {search.name}
  //                 </option>
  //               ))}
  //             </select>

  //             {/* ✅ Show validation errors for dropdown */}
  //             {showValidation && errors.name && (
  //               <p className="text-red-600 font-semibold text-sm mt-1">{errors.name}</p>
  //             )}
  //           </div>
  //         )}

  //         {/* Checkbox */}
  //         <div className="mt-6 flex items-center space-x-2">
  //           <input
  //             type="checkbox"
  //             id="defaultSearch"
  //             className="accent-primary"
  //             checked={defaultSearch}
  //             onChange={() => setDefaultSearch(!defaultSearch)}
  //           />
  //           <label htmlFor="defaultSearch" className="font-inter text-[22px] cursor-pointer">
  //             Set as Default Search
  //           </label>
  //         </div>
  //       </div>
  //     </form>
  //   );
  // };

  // export default SavedSearchForm;











  import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SavedSearchForm = ({
  searchOption,
  setSearchOption,
  selectedSavedSearch,
  setSelectedSavedSearch,
  defaultSearch,
  setDefaultSearch,
  searchName,
  setSearchName,
  savedSearch,
  setSavedSearch,
  selectedSearch,
  setSelectedSearch, // ✅ ADD: Function to clear selectedSearch in parent
  filters,
  setFilters,
  showValidation,
  errors,
  setErrors
}) => {
  const { savedSearches } = useSelector((state) => state.savedSearches);

  const decodeQueryStringToFilters = (queryString) => {
    const clean = queryString.startsWith("?") ? queryString.substring(1) : queryString;
    const params = new URLSearchParams(clean);

    const filters = {
      status: "",
      keyword: { include: [], exclude: [] },
      location: [],
      UNSPSCCode: [],
      solicitationType: [],
      NAICSCode: [],
      publishedDate: {},
      closingDate: {},
    };

    if (params.get("bid_type")) filters.status = params.get("bid_type");
    if (params.get("state")) filters.location = params.get("state").split(",");
    if (params.get("solicitation")) filters.solicitationType = params.get("solicitation").split(",");
    if (params.get("include")) filters.keyword.include = params.get("include").split(",");
    if (params.get("exclude")) filters.keyword.exclude = params.get("exclude").split(",");
    if (params.get("unspsc_codes")) filters.UNSPSCCode = params.get("unspsc_codes").split(",").map((code) => ({ code }));
    if (params.get("naics_codes")) filters.NAICSCode = params.get("naics_codes").split(",").map((code) => ({ code }));
    if (params.get("open_date_after")) filters.publishedDate.after = params.get("open_date_after");
    if (params.get("open_date_before")) filters.publishedDate.before = params.get("open_date_before");
    if (params.get("closing_date_after")) filters.closingDate.after = params.get("closing_date_after");
    if (params.get("closing_date_before")) filters.closingDate.before = params.get("closing_date_before");

    return filters;
  };

  useEffect(() => {
    // ✅ Only apply selectedSearch data if we're in replace mode or haven't explicitly switched to create
    if (selectedSearch && searchOption === "replace") {
      setSearchName(selectedSearch.name);
      setSavedSearch((prev) => ({
        ...prev,
        name: selectedSearch.name,
        id: selectedSearch.id,
      }));

      const savedSearchObj = savedSearches.find((s) => s.id === selectedSearch.id);
      if (savedSearchObj?.query_string) {
        setFilters(decodeQueryStringToFilters(savedSearchObj.query_string));
      }
    }
  }, [selectedSearch, savedSearches, setFilters, setSavedSearch, searchOption]);

  const handleCreateOption = () => {
    setSearchOption("create");
    setSelectedSavedSearch("");
    setSearchName("");
    setSavedSearch((prev) => ({
      ...prev,
      name: "",
      id: null,
    }));
    setErrors({ name: "" });

    // ✅ Reset filters when switching from Replace to Create
    setFilters({
      status: "",
      keyword: { include: [], exclude: [] },
      location: [],
      UNSPSCCode: [],
      solicitationType: [],
      NAICSCode: [],
      publishedDate: {},
      closingDate: {},
    });

    // ✅ Clear the selectedSearch in parent component
    if (setSelectedSearch) {
      setSelectedSearch(null);
      console.log("🧹 Cleared selectedSearch in parent component");
    }
  };

  const handleReplaceOption = () => {
    setSearchOption("replace");
    setSearchName("");
    setSelectedSavedSearch("");
    setSavedSearch((prev) => ({
      ...prev,
      name: "",
      id: null,
    }));
    setErrors({ name: "" });

    // ✅ Do not reset filters here; filters will load only when a saved search is selected
  };

  const handleOnChangeInput = (e) => {
    const { value } = e.target;
    const trimmed = value.trim();
    setSearchName(value);
    setSelectedSavedSearch(value);
    setSavedSearch((prev) => ({
      ...prev,
      name: value,
    }));

    if (!trimmed) {
      setErrors({ name: "This field is required" });
    } else if (
      searchOption === "create" &&
      savedSearches.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setErrors({ name: "Search name already exists" });
    } else {
      setErrors({ name: "" });
    }

    setSavedSearch((prev) => ({
      ...prev,
      name: value,
      id: searchOption === "replace" ? selectedSavedSearch : null,
    }));
  };

  const handleDropdownChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedSavedSearch(id);

    if (!id) {
      setErrors({ name: "Please select a saved search to replace" });
      setSearchName("");
      setSavedSearch((prev) => ({
        ...prev,
        name: "",
        id: null,
      }));
      return;
    }

    const selected = savedSearches.find((s) => s.id === id);
    if (selected) {
      setSearchName(selected.name);
      setSavedSearch((prev) => ({
        ...prev,
        name: selected.name,
        id,
      }));
      if (selected.query_string) {
        setFilters(decodeQueryStringToFilters(selected.query_string));
      }
      setErrors({ name: "" });
    }
  };

  return (
    <form className="min-h-screen flex flex-col justify-between p-10 bg-white">
      <div>
        <h2 className="font-medium mb-4 font-inter text-p">Search</h2>

        {/* Radio Buttons */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="searchOption"
              value="create"
              className="accent-blue-600"
              checked={searchOption === "create"}
              onChange={handleCreateOption}
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
              onChange={handleReplaceOption}
            />
            <span className="font-inter text-[22px]">Replace an existing saved search</span>
          </label>
        </div>

        {/* Input Field for Create Option */}
        {searchOption === "create" ? (
          <div className="mt-8">
            <label className="block font-medium mb-2 font-inter text-p">Search Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter search name"
              className={`border rounded-lg px-4 py-2 font-inter text-xl w-[300px]
                ${showValidation && errors.name ? "border-red-500" : "border-[#273BE280]"}`}
              value={searchName}
              onChange={handleOnChangeInput}
              onBlur={handleOnChangeInput}
            />

            {showValidation && errors.name && (
              <p className="text-red-600 font-semibold text-sm mt-1">{errors.name}</p>
            )}
          </div>
        ) : (
          <div className="form-group mt-8">
            <label className="font-medium mb-2 font-inter text-p block">
              Replace an existing saved search
            </label>
            <select
              className={`form-control border rounded-lg px-4 py-2 font-inter text-xl w-[300px]
                ${showValidation && errors.name ? "border-red-500" : "border-primary"}`}
              value={selectedSavedSearch}
              onChange={handleDropdownChange}
            >
              <option value="">Select saved search</option>
              {savedSearches.map((search) => (
                <option key={search.id} value={search.id}>
                  {search.name}
                </option>
              ))}
            </select>

            {showValidation && errors.name && (
              <p className="text-red-600 font-semibold text-sm mt-1">{errors.name}</p>
            )}
          </div>
        )}

        {/* Checkbox */}
        {/* <div className="mt-6 flex items-center space-x-2">
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
        </div> */}
      </div>
    </form>
  );
};

export default SavedSearchForm;
