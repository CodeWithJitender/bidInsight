import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Trash2 } from "lucide-react";
import { getSolicitationTypes } from "../../services/user.service.js";

const mockOptions = [
  { name: "Type A" }, { name: "Type B" }, { name: "Type C" }, { name: "Type D" },
  { name: "Type E" }, { name: "Type F" }, { name: "Type G" }, { name: "Type H" },
  { name: "Type I" }, { name: "Type J" }, { name: "Type K" }, { name: "Type L" },
  { name: "Type M" }, { name: "Type N" }, { name: "Type O" }, { name: "Type P" },
  { name: "Type Q" }, { name: "Type R" }, { name: "Type S" }, { name: "Type T" },
  { name: "Type U" }, { name: "Type V" },
];

const SolicitationTypeTab = ({ filters = {}, setFilters = () => {} }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNames, setSelectedNames] = useState(filters.solicitationType || []);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const response = await getSolicitationTypes();
        const sorted = response.sort((a, b) =>
          (a.name || a).toLowerCase().localeCompare((b.name || b).toLowerCase())
        );
        setOptions(sorted);
      } catch (error) {
        console.error("Error fetching types:", error);
        const fallbackSorted = mockOptions.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setOptions(fallbackSorted);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  // Memoized filtered options
  const filteredOptions = useMemo(() => {
    return options.filter((item) =>
      (item.name || item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  const allVisibleNames = useMemo(() => {
    return filteredOptions.map((item) => item.name || item);
  }, [filteredOptions]);

  const isAllSelected = useMemo(() => {
    return (
      allVisibleNames.length > 0 &&
      allVisibleNames.every((name) => selectedNames.includes(name))
    );
  }, [allVisibleNames, selectedNames]);

  // Update filter helper
  const updateFilter = useCallback((updated) => {
    setSelectedNames(updated);
    setFilters((prev) => ({ ...prev, solicitationType: updated }));
  }, [setFilters]);

  const toggleSelect = useCallback((name) => {
    const updated = selectedNames.includes(name)
      ? selectedNames.filter((n) => n !== name)
      : [...selectedNames, name];
    updateFilter(updated);
  }, [selectedNames, updateFilter]);

  const toggleAllVisible = useCallback(() => {
    const updated = isAllSelected
      ? selectedNames.filter((name) => !allVisibleNames.includes(name))
      : Array.from(new Set([...selectedNames, ...allVisibleNames]));
    updateFilter(updated);
  }, [isAllSelected, allVisibleNames, selectedNames, updateFilter]);

  const clearAll = useCallback(() => {
    updateFilter([]);
  }, [updateFilter]);

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      <div>
        {/* Search */}
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

        {/* Selected */}
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

          {/* Filtered List */}
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
