import React, { useState } from "react";
import { Trash2, Search } from "lucide-react";

const MOCK_NAICS = [
  { code: "111110", description: "Soybean Farming" },
  { code: "111120", description: "Oilseed (except Soybean) Farming" },
  { code: "111130", description: "Dry Pea and Bean Farming" },
  { code: "111140", description: "Wheat Farming" },
  { code: "111150", description: "Corn Farming" },
  { code: "111160", description: "Rice Farming" },
  { code: "111191", description: "Oilseed and Grain Combination Farming" },
  { code: "111199", description: "All Other Grain Farming" },
  { code: "112111", description: "Beef Cattle Ranching and Farming" },
  { code: "112112", description: "Cattle Feedlots" },
  { code: "112120", description: "Dairy Cattle and Milk Production" },
  { code: "112210", description: "Hog and Pig Farming" },
  { code: "112310", description: "Chicken Egg Production" },
  { code: "112320", description: "Broilers and Other Meat Type Chicken Production" },
  { code: "112330", description: "Turkey Production" },
  { code: "112340", description: "Poultry Hatcheries" },
  { code: "112390", description: "Other Poultry Production" },
  { code: "113110", description: "Timber Tract Operations" },
  { code: "113210", description: "Forest Nurseries and Gathering of Forest Products" },
  { code: "113310", description: "Logging" },
  { code: "114111", description: "Finfish Fishing" },
  { code: "114112", description: "Shellfish Fishing" },
  { code: "114119", description: "Other Marine Fishing" },
];

const NAICSCode = () => {
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelect = (item) => {
    const isSelected = selected.some((s) => s.code === item.code);
    const updated = isSelected
      ? selected.filter((s) => s.code !== item.code)
      : [...selected, item];
    setSelected(updated);
  };

  const removeSelected = (code) => {
    setSelected(selected.filter((item) => item.code !== code));
  };

  const filtered = MOCK_NAICS.filter(
    (item) =>
      item.code.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14 overflow-y-auto">
      <div>
        {/* Search */}
        <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search by code or description"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
          </div>
        </div>

        {/* Selected Items */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-p font-medium">
            Selected NAICS Codes <span className="text-primary">({selected.length})</span>
          </h2>
          {selected.length > 0 && (
            <button className="text-lg underline font-inter" onClick={() => setSelected([])}>
              Clear All
            </button>
          )}
        </div>

        {selected.map((item) => (
          <div
            key={item.code}
            className="flex items-start justify-between text-sm py-2 border-b font-inter"
          >
            <div className="flex items-center gap-10">
              <div className="font-medium text-lg">{item.code}</div>
              <div>{item.description}</div>
            </div>
            <button className="text-primary ml-4" onClick={() => removeSelected(item.code)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* List */}
        <div className="border-[#273BE280] border-[2px] rounded-[10px] mt-6 overflow-y-auto">
          <div className="text-p font-medium font-inter border-b px-4 py-3">
            Available NAICS Codes
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-4 text-gray-500">No results found</div>
          )}
          {filtered.map((item) => (
            <label
              key={item.code}
              className="flex items-center gap-5 py-2 cursor-pointer font-inter px-8 text-xl border-t-[2px] border-[#273BE280]"
            >
              <input
                type="checkbox"
                className="mt-1 accent-primary"
                checked={selected.some((s) => s.code === item.code)}
                onChange={() => toggleSelect(item)}
              />
              <div className="font-semibold text-lg">{item.code}</div>
              <div className="text-[16px]">{item.description}</div>
            </label>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default NAICSCode;
