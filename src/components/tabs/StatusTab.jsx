import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For URL sync

function StatusTab({
  filters,
  setFilters,
  onApply,
  setActiveTab,
  searchOption,
  setShowValidation,
  setTriggerSave,
  onClose,
  triggerSave,
  onSubmit,
  defaultSearch,
  selectedSavedSearch,
}) {
  const navigate = useNavigate();
  const isCreating = searchOption === "create";
  const isReplacing = searchOption === "replace";

  const handleFormSubmit = () => {
    const nameMissing = !filters.searchName?.trim();

    if (isCreating && nameMissing) {
      setShowValidation?.(true);
      setActiveTab?.("Save Search Form");
      return;
    }

    if (isReplacing && !selectedSavedSearch?.id) {
      alert("Please select a saved search to replace.");
      return;
    }

    const payload = {
      action: searchOption,
      name: isCreating ? filters.searchName.trim() : selectedSavedSearch?.name,
      id: selectedSavedSearch?.id,
      isDefault: defaultSearch,
      filters: {
        status: filters.status,
        personalised: filters.personalised,
      },
    };

    console.log("🚀 Submit Payload:", payload);
    onSubmit?.(payload);
    setShowValidation?.(false);
    onClose?.();
  };

  // 🔁 Triggered when user clicks "Save" in parent (via setTriggerSave)
  useEffect(() => {
    if (triggerSave) {
      handleFormSubmit();
      setTriggerSave(false);
    }
  }, [triggerSave]);

  const handleSearchClick = () => {
    console.log("🔵 Search button clicked!");

    // 🛑 Validation check (only during 'create')
    if (isCreating && !filters.searchName?.trim()) {
      setShowValidation?.(true);
      setActiveTab?.("Save Search Form");
      return;
    }

    // ✅ Update URL
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.personalised) params.set("personalised", filters.personalised);

    navigate(`?${params.toString()}`);

    if (isCreating) {
      console.log("🟢 Trigger Save (create)");
      setTriggerSave?.(true);
    } else if (isReplacing) {
      // ✅ FIX: Call onSubmit for replace
      const payload = {
        action: "replace",
        name: selectedSavedSearch?.name,
        id: selectedSavedSearch?.id,
        isDefault: defaultSearch,
        filters: {
          status: filters.status,
          personalised: filters.personalised,
        },
      };
      console.log("🟢 Trigger Save (replace)", payload);
      onSubmit?.(payload);
      setShowValidation?.(false);
      onClose?.();
    } else {
      // fallback
      onApply?.();
      onClose?.();
    }
  };

  const handleCancel = () => {
    setFilters((prev) => ({
      ...prev,
      status: "",
      personalised: "",
    }));
    setShowValidation?.(false);
    setActiveTab?.("Save Search Form");
    onApply?.(); // Apply cleared filters
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit();
  };

  useEffect(() => {
    console.log("🧠 selectedSavedSearch in StatusTab →", selectedSavedSearch);
  }, [selectedSavedSearch]);

  useEffect(() => {
    console.log("🟨 filters updated in StatusTab:", filters);
  }, [filters]);

  // useEffect(() => {
  //   if (!filters.status) {
  //     setFilters((prev) => ({ ...prev, status: "Open Solicitations" }));
  //   }
  // }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
        <div>
          <div className="space-y-6">
            {/* Solicitations Radio Group */}
            <div>
              <h2 className="text-p font-inter font-medium mb-2">Solicitations</h2>
              <div className="space-y-3">
                {["Open Solicitations", "Closed Solicitations", "Awarded Solicitations"].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="solicitation"
                      value={option}
                      checked={filters.status === option}
                      onChange={() => setFilters((prev) => ({ ...prev, status: option }))}
                      className="accent-purple-600"
                    />
                    <span className="font-inter text-xl">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Personalised Filter */}
            <div>
              <h2 className="text-p font-inter font-medium mb-2">Personalised</h2>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="personalised"
                  value="My Invitations Only"
                  checked={filters.personalised === "My Invitations Only"}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      personalised: "My Invitations Only",
                    }))
                  }
                  className="accent-purple-600"
                />
                <span className="font-inter text-xl">My Invitations Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 pt-10">
          <button
            type="button"
            className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
            onClick={handleSearchClick}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default StatusTab;
