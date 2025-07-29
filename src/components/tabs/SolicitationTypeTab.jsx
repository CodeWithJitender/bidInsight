import React, { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import { getSolicitationTypes } from "../../services/bid.service.js";

const SolicitationTypeTab = ({
  filters = {},
  setFilters = () => {},
}) => {
  // Mock static options list as fallback
  const mockOptions = [
    { name: "Type A" },
    { name: "Type B" },
    { name: "Type C" },
    { name: "Type D" },
    { name: "Type E" },
    { name: "Type F" },
    { name: "Type G" },
    { name: "Type H" },
    { name: "Type I" },
    { name: "Type J" },
    { name: "Type K" },
    { name: "Type L" },
    { name: "Type M" },
    { name: "Type N" },
    { name: "Type O" },
    { name: "Type P" },
    { name: "Type Q" },
    { name: "Type R" },
    { name: "Type S" },
    { name: "Type T" },
    { name: "Type U" },
    { name: "Type V" },
  ];

  // State management
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNames, setSelectedNames] = useState(filters.solicitationType || []);
  const [searchTerm, setSearchTerm] = useState("");

  // console.log(filters);

  // Fetch solicitation types from API
  useEffect(() => {
    const fetchSolicitationTypes = async () => {
      try {
        setLoading(true);
        const response = await getSolicitationTypes();
        console.log('Solicitation Types API Response:', response);
        setOptions(response); // For now, using the response directly until we see the structure
      } catch (error) {
        console.error("Error fetching solicitation types:", error);
        // Fallback to mock data if API fails
        setOptions(mockOptions);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitationTypes();
  }, []);

  // Sync local state with filters prop when filters change from outside
  useEffect(() => {
    if (filters.solicitationType && Array.isArray(filters.solicitationType)) {
      setSelectedNames(filters.solicitationType);
    }
  }, [filters.solicitationType]);

  // Filter options by search term (supports both object and string formats)
  const filteredOptions = options.filter((item) => {
    const name = item.name || item;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Toggle selection for one item
  const toggleSelect = (name) => {
    const updated = selectedNames.includes(name)
      ? selectedNames.filter((n) => n !== name)
      : [...selectedNames, name];
    
    setSelectedNames(updated);
    // Update the filters with the new selection
    setFilters({
      ...filters,
      solicitationType: updated
    });
  };

  // Clear all selected
  const clearAll = () => {
    setSelectedNames([]);
    // Clear the filters as well
    setFilters({
      ...filters,
      solicitationType: []
    });
  };

  // "Select All" checkbox state
  const allVisibleNames = filteredOptions.map((item) => item.name || item);
  const isAllSelected =
    allVisibleNames.length > 0 &&
    allVisibleNames.every((name) => selectedNames.includes(name));

  // Toggle all visible options
  const toggleAllVisible = () => {
    if (isAllSelected) {
      // Remove all visible from selected
      const updated = selectedNames.filter((name) => !allVisibleNames.includes(name));
      setSelectedNames(updated);
      setFilters({
        ...filters,
        solicitationType: updated
      });
    } else {
      // Add all visible options to selected (avoid duplicates)
      const updated = Array.from(new Set([...selectedNames, ...allVisibleNames]));
      setSelectedNames(updated);
      setFilters({
        ...filters,
        solicitationType: updated
      });
    }
  };

  // Remove the useEffect that was automatically syncing to filters
  // We now handle this manually in the toggle functions

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      <div>
        {/* Search Bar */}
        <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bid types"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
              size={18}
            />
          </div>
        </div>

        {/* Selected Chips */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-p font-medium font-inter">
            Selected Types <span className="text-primary">({selectedNames.length})</span>
          </h2>
          {selectedNames.length > 0 && (
            <button onClick={clearAll} className="text-lg underline font-inter">
              Clear All
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {selectedNames.map((name) => (
            <div
              key={name}
              className="flex items-center border-[2px] border-primary rounded-full px-4 py-1 text-sm gap-2"
            >
              <span>{name}</span>
              <button
                onClick={() => toggleSelect(name)}
                className="text-primary"
                aria-label={`Remove ${name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Select All Toggle */}
        <div className="border-[2px] border-[#273BE280] rounded-[10px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#273BE280] bg-gray-50">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="accent-primary"
                checked={isAllSelected}
                onChange={toggleAllVisible}
              />
              <span className="text-p font-inter font-medium">Select All</span>
            </div>
          </div>

          {/* Filtered Bid Types List */}
          <div className="divide-y divide-[#273BE280] max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading solicitation types...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No solicitation types found</div>
            ) : (
              filteredOptions.map((item) => {
                const itemName = item.name || item;
                return (
                  <label
                    key={itemName}
                    className="flex items-center px-4 py-2 cursor-pointer text-[16px] font-inter"
                  >
                    <input
                      type="checkbox"
                      className="accent-primary mr-3"
                      checked={selectedNames.includes(itemName)}
                      onChange={() => toggleSelect(itemName)}
                    />
                    <span className="text-gray-800">{itemName}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default SolicitationTypeTab;
