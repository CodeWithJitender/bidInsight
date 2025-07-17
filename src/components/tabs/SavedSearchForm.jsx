// import React, { useState } from "react";

// const SavedSearchForm = () => {
//   const [searchOption, setSearchOption] = useState("replace");
//   const [defaultSearch, setDefaultSearch] = useState(false);
//   const [newSearchName, setNewSearchName] = useState("");
//   const [selectedSavedSearch, setSelectedSavedSearch] = useState("");

//   const savedSearches = ["Search A", "Search B", "Search C"];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = {
//       action: searchOption,
//       name: searchOption === "create" ? newSearchName : selectedSavedSearch,
//       isDefault: defaultSearch,
//     };
//     console.log(data);
//     // Implement backend logic here
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="min-h-screen flex flex-col justify-between p-10 bg-white"
//     >
//       <div>
//         <h2 className=" font-medium mb-4 font-inter text-p">Search</h2>

//         <div className="space-y-2">
//           <label className="flex items-center space-x-2">
//             <input
//               type="radio"
//               name="searchOption"
//               value="create"
//               checked={searchOption === "create"}
//               onChange={() => setSearchOption("create")}
//               className="accent-blue-600"
//             />
//             <span className="font-inter text-[22px]">
//               Create a new saved search
//             </span>
//           </label>

//           <label className="flex items-center space-x-2">
//             <input
//               type="radio"
//               name="searchOption"
//               value="replace"
//               checked={searchOption === "replace"}
//               onChange={() => setSearchOption("replace")}
//               className="accent-blue-600"
//             />
//             <span className="font-inter text-[22px]">
//               Replace an existing saved search
//             </span>
//           </label>
//         </div>

//         <div className="mt-8">
//           <label className="block font-medium mb-4 font-inter text-p">
//             Search Name
//           </label>

//           {searchOption === "create" ? (
//             <input
//               type="text"
//               placeholder="Enter search name"
//               value={newSearchName}
//               onChange={(e) => setNewSearchName(e.target.value)}
//               className="border border-[#273BE280] rounded-lg px-4 py-2 font-inter text-xl "
//             />
//           ) : (
//             <div className="border border-primary bg-btn rounded-full px-4 py-2 inline-block">
//               <select
//                 className=""
//                 value={selectedSavedSearch}
//                 onChange={(e) => setSelectedSavedSearch(e.target.value)}
//               >
//                 <option value="">My Saved Searches</option>
//                 {savedSearches.map((search) => (
//                   <option key={search} value={search}>
//                     {search}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>

//         <div className="mt-6 flex items-center space-x-2">
//           <input
//             type="checkbox"
//             id="defaultSearch"
//             checked={defaultSearch}
//             onChange={() => setDefaultSearch(!defaultSearch)}
//             className="accent-primary "
//           />
//           <label htmlFor="defaultSearch" className="font-inter text-[22px]">
//             Set as Default Search
//           </label>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4 p-5 ps-0 bg-white sticky bottom-0">
//         <button className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all">
//           Cancel
//         </button>
//         <button className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all">
//           Search
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SavedSearchForm;
import React from "react";

const SavedSearchForm = ({
  filters,
  setFilters,
  onCancel,
  onSubmit,
  savedFilters = [],
  defaultSearch,
  setDefaultSearch,
  searchOption,
  setSearchOption,
  selectedSavedSearch,
  setSelectedSavedSearch,
}) => {
  const savedSearches = Array.isArray(savedFilters)
    ? savedFilters.map((item) => item.search_name || item.name)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchOption === "replace" && !selectedSavedSearch) {
      alert("Please select a saved search to replace.");
      return;
    }

    if (searchOption === "create" && !filters.searchName.trim()) {
      alert("Please enter a search name to create.");
      return;
    }

    const data = {
      action: searchOption,
      name: searchOption === "create" ? filters.searchName : selectedSavedSearch,
      isDefault: defaultSearch,
    };

    console.log("🔍 SaveSearch Submitted: ", data);
    onSubmit?.(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex flex-col justify-between p-10 bg-white"
    >
      <div>
        <h2 className="font-medium mb-4 font-inter text-p">Search</h2>

        {/* Radio options */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="searchOption"
              value="create"
              checked={searchOption === "create"}
              onChange={() => setSearchOption("create")}
              className="accent-blue-600"
            />
            <span className="font-inter text-[22px]">Create a new saved search</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="searchOption"
              value="replace"
              checked={searchOption === "replace"}
              onChange={() => setSearchOption("replace")}
              className="accent-blue-600"
            />
            <span className="font-inter text-[22px]">Replace an existing saved search</span>
          </label>
        </div>

        {/* Input or Dropdown */}
        <div className="mt-8">
          <label className="block font-medium mb-4 font-inter text-p">Search Name</label>

          {searchOption === "create" ? (
            <input
              type="text"
              placeholder="Enter search name"
              value={filters.searchName}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  searchName: e.target.value,
                }))
              }
              className="border border-[#273BE280] rounded-lg px-4 py-2 font-inter text-xl"
            />
          ) : (
            <div className="border border-primary bg-btn rounded-full px-4 py-2 inline-block">
              <select
                value={selectedSavedSearch}
                onChange={(e) => setSelectedSavedSearch(e.target.value)}
              >
                <option value="" disabled hidden>
                  My Saved Searches
                </option>
                {savedSearches.map((search) => (
                  <option key={search} value={search}>
                    {search}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Default checkbox */}
        <div className="mt-6 flex items-center space-x-2">
          <input
            type="checkbox"
            id="defaultSearch"
            checked={defaultSearch}
            onChange={() => setDefaultSearch(!defaultSearch)}
            className="accent-primary"
          />
          <label htmlFor="defaultSearch" className="font-inter text-[22px]">
            Set as Default Search
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 p-5 ps-0 bg-white sticky bottom-0">
        <button
          type="button"
          onClick={onCancel}
          className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
        >
          Save Search
        </button>
      </div>
    </form>
  );
};

export default SavedSearchForm;
