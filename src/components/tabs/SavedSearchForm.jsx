import React, { useEffect } from "react";

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
  showValidation = false,
  onSelectSavedSearch = () => { },
  setShowValidation = () => { },
  triggerSave = false,
  setTriggerSave = () => { },
}) => {
  const savedSearches = Array.isArray(savedFilters) ? savedFilters : [];
  // console.log(savedSearches);
  const handleFormSubmit = () => {
    const isCreate = searchOption === "create";
    const isReplace = searchOption === "replace";

    if (isCreate && !filters.searchName?.trim()) {
      setShowValidation(true);
      return;
    }

    if (isReplace && !selectedSavedSearch?.id) {
      alert("Please select a saved search to replace.");
      return;
    }

    const data = {
      action: searchOption,
      name: isCreate
        ? filters.searchName.trim()
        : selectedSavedSearch?.name,
      id: selectedSavedSearch?.id,
      isDefault: defaultSearch,
      filters: filters,
    };

    onSubmit?.(data);
    setShowValidation(false);

    if (isCreate) {
      setSelectedSavedSearch({
        id: null,
        name: filters.searchName.trim(),
      });
    }
  };

  useEffect(() => {
    if (triggerSave) {
      handleFormSubmit();
      setTriggerSave(false);
    }
  }, [triggerSave]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex flex-col justify-between p-10 bg-white"
    >
      <div>
        <h2 className="font-medium mb-4 font-inter text-p">Search</h2>

        {/* Radio buttons */}
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

        {/* Create: Input field */}
        {searchOption === "create" && (
          <>
            <label className="block font-medium mb-4 font-inter text-p mt-8">Search Name</label>
            <input
              type="text"
              placeholder="Enter search name"
              value={filters.searchName || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  searchName: e.target.value,
                }))
              }
              className={`border ${showValidation && !filters.searchName?.trim()
                ? "border-red-500"
                : "border-[#273BE280]"
                } rounded-lg px-4 py-2 font-inter text-xl`}
            />
            {showValidation && !filters.searchName?.trim() && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </>
        )}

        {/* Replace: Dropdown */}
        {searchOption === "replace" && (
          <div className="form-group mt-8">
            <label
              htmlFor="existingSearch"
              className="font-medium mb-4 font-inter text-p block"
            >
              Replace an existing saved search
            </label>
            <select
              id="existingSearch"
              className="form-control border border-primary rounded-lg px-4 py-2 font-inter text-xl"
              value={selectedSavedSearch?.id || ""}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value, 10);
                const selected = savedSearches.find((s) => s.id === selectedId);
                setSelectedSavedSearch(selected || null);

                // ✅ Critical: Tell parent to apply filters from saved search
                if (selected && typeof onSelectSavedSearch === "function") {
                  onSelectSavedSearch(selected);
                }
              }}
            >
              <option value="">Select saved search</option>
              {savedSearches.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
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
            checked={defaultSearch}
            onChange={() => setDefaultSearch(!defaultSearch)}
            className="accent-primary"
          />
          <label htmlFor="defaultSearch" className="font-inter text-[22px]">
            Set as Default Search
          </label>
        </div>
      </div>

      {/* Footer buttons */}
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