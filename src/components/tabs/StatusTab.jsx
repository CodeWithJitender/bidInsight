import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";

function StatusTab({filters = {}, setFilters = () => {}}) {

  console.log("❤️ StatusTab rendered with filters:", filters);

  // Handle radio button change
  const handleSolicitationChange = (e) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === "Active") {
      // Open Solicitations - only Active bids
      setFilters({
        ...filters, 
        status: "Active"
      });
    } else if (selectedValue === "Closed") {
      // Closed Solicitations - both Inactive and Awarded
      setFilters({
        ...filters, 
        status: "Inactive,Awarded"  // Multiple statuses comma-separated
      });
    }
  };

  // Determine which radio should be checked
  const getCurrentSelection = () => {
    if (filters.status === "Active") {
      return "Active";
    } else if (filters.status === "Inactive,Awarded" || filters.status === "Inactive" || filters.status === "Awarded") {
      return "Closed";
    }
    return "";
  };

  // 🔥 NEW: Clear all selections function
  const handleClearAll = () => {
    setFilters({
      ...filters,
      status: ""
    });
  };

  // 🔥 NEW: Check if any filter is active
  const hasActiveFilter = filters.status && filters.status !== "";

  // 🔥 NEW: Get display text for active filter
  const getActiveFilterText = () => {
    if (filters.status === "Active") {
      return "Open Solicitations (Active bids only)";
    } else if (filters.status === "Inactive,Awarded" || filters.status === "Inactive" || filters.status === "Awarded") {
      return "Closed Solicitations (Inactive + Awarded bids)";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="flex flex-col gap-6">
        <div className="space-y-6">
          {/* Solicitations Radio Group */}
          <div>
            <h2 className="text-p font-inter font-bold mb-2">Solicitations</h2>
            <div className="space-y-3">
              {[
                { label: "Open Solicitations", value: "Active", description: "Active bids only" },
                { label: "Closed Solicitations", value: "Closed", description: "Inactive + Awarded bids" }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="solicitation"
                    value={option.value}
                    className="accent-purple-600"
                    checked={getCurrentSelection() === option.value}
                    onChange={handleSolicitationChange}
                  />
                  <div className="flex flex-col">
                    <span className="font-inter text-xl">{option.label}</span>
                    <span className="font-inter text-sm text-gray-500">{option.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 🔥 NEW: Selected Filter Display - Bottom approach */}
          {hasActiveFilter && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-inter text-sm font-medium">Active Filter:</span>
                  <div className="font-inter mt-1">
                    {getActiveFilterText()}
                  </div>
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-blue-600 w-8 hover:text-blue-800 text-lg underline"
                >
                 <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          )}

          {/* Debug Info - Remove this in production */}
          {/* <div className="mt-4 p-3 max-w-96 bg-gray-100 rounded text-sm">
            <strong>Current Status Filter:</strong> {filters.status || "None"}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default StatusTab;