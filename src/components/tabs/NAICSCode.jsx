
import React, { useEffect, useState } from "react";
import { Trash2, Search } from "lucide-react";
import { getNAICSCodes } from "@/services/bid.service";


const NAICSCode = ({ filters, setFilters }) => {
  const [allNAICS, setAllNAICS] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const selected = filters.NAICSCode || [];


  useEffect(() => {
    const fetchNAICSCodes = async () => {
      try {
        const data = await getNAICSCodes();
        setAllNAICS(data); // assuming data = [{ code: "111110", description: "Soybean Farming" }, ...]
      } catch (error) {
        console.error("Failed to load NAICS codes:", error);
      }
    };


    fetchNAICSCodes();
  }, []);


  const toggleSelect = (item) => {
    const isSelected = selected.some((s) => s.code === item.code);
    const updated = isSelected
      ? selected.filter((s) => s.code !== item.code)
      : [...selected, item];
    setFilters({ ...filters, NAICSCode: updated });
  };


  const removeSelected = (code) => {
    const updated = selected.filter((item) => item.code !== code);
    setFilters({ ...filters, NAICSCode: updated });
  };


  const filtered = allNAICS.filter(
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
            <button className="text-lg underline font-inter" onClick={() => setFilters({ ...filters, NAICSCode: [] })}>
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


        {/* Available List */}
        <div className="border-[#273BE280] border-[2px] rounded-[10px] mt-6 overflow-y-auto max-h-[50vh]">
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
