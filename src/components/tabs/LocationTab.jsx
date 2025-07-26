import React, { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import { getAllStates } from "../../services/bid.service.js";



const LocationTab = ({ filters = {}, setFilters = () => {} }) => {
  const [selectedStates, setSelectedStates] = useState(filters.location || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch states from API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await getAllStates();
        console.log('States API Response:', response);
        setStates(response); // For now, using the response directly until we see the structure
      } catch (error) {
        console.error("Error fetching states:", error);
        // Fallback to hardcoded states if API fails
        setStates(US_STATES.map(state => ({ name: state })));
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  // Sync local state with filters prop when filters change from outside
  useEffect(() => {
    if (filters.location && Array.isArray(filters.location)) {
      setSelectedStates(filters.location);
    }
  }, [filters.location]);

  // Filter states based on search input - will need to adjust based on API response structure
  const filteredStates = states.filter((state) =>
    (state.name || state).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected =
    filteredStates.length > 0 &&
    filteredStates.every((state) => selectedStates.includes(state.name || state));

  const toggleState = (stateName) => {
    const updated = selectedStates.includes(stateName)
      ? selectedStates.filter((s) => s !== stateName)
      : [...selectedStates, stateName];
    
    setSelectedStates(updated);
    // Update the filters with the new selection
    setFilters({
      ...filters,
      location: updated
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Remove all visible states from selected
      const visibleStateNames = filteredStates.map(state => state.name || state);
      const updated = selectedStates.filter((state) => !visibleStateNames.includes(state));
      setSelectedStates(updated);
      setFilters({
        ...filters,
        location: updated
      });
    } else {
      // Add all visible states
      const visibleStateNames = filteredStates.map(state => state.name || state);
      const updated = Array.from(new Set([...selectedStates, ...visibleStateNames]));
      setSelectedStates(updated);
      setFilters({
        ...filters,
        location: updated
      });
    }
  };

  const clearAll = () => {
    setSelectedStates([]);
    setFilters({
      ...filters,
      location: []
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      <div>
        {/* Search Input */}
        <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search states"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
              size={18}
            />
          </div>
        </div>

        {/* Selected States */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-p font-medium font-inter">
            Selected States{" "}
            <span className="text-primary">({selectedStates.length})</span>
          </h2>
          {selectedStates.length > 0 && (
            <button
              onClick={clearAll}
              className="text-lg underline font-inter"
              aria-label="Clear all selected states"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {selectedStates.map((stateName) => (
            <div
              key={stateName}
              className="flex border-[2px] gap-1 px-3 rounded-[30px] border-primary items-center justify-between text-lg py-1 font-inter"
            >
              <div>{stateName}</div>
              <button
                onClick={() => toggleState(stateName)}
                className="text-primary"
                aria-label={`Remove ${stateName}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* States List with Select All */}
        <div className="border-[#273BE280] border-[2px] rounded-[10px] max-h-[400px] overflow-y-auto">
          <div className="flex items-center px-4 py-3 border-b font-medium font-inter text-p">
            <input
              type="checkbox"
              className="accent-primary mr-3"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              aria-label="Select all visible states"
            />
            <span>Select All States</span>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading states...</div>
          ) : filteredStates.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No states found</div>
          ) : (
            filteredStates.map((state) => {
              const stateName = state.name || state;
              const isSelected = selectedStates.includes(stateName);
              return (
                <label
                  key={stateName}
                  className="flex items-center gap-5 py-2 cursor-pointer font-inter px-4 text-xl border-[#273BE280] border-t-[2px]"
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-primary"
                    checked={isSelected}
                    onChange={() => toggleState(stateName)}
                    aria-label={`Select state ${stateName}`}
                  />
                  <div className="text-[16px]">{stateName}</div>
                </label>
              );
            })
          )}
        </div>
      </div>

     
    </div>
  );
};

export default LocationTab;
