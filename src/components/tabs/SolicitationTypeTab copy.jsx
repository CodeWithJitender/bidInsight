import React, { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import api from "../../utils/axios";

const SolicitationTypeTab = ({ filters = {}, setFilters = () => { }, onApply = () => { } }) => {
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get("/bids/solicitation/");
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setOptions(sorted);
      } catch (err) {
        console.error("Error fetching bid types:", err);
      }
    };
    fetchTypes();
  }, []);

  const selectedNames = Array.isArray(filters.solicitationType)
    ? filters.solicitationType
    : [];

  const toggleSelect = (item) => {
    const isAlreadySelected = selectedNames.includes(item.name);
    const updated = isAlreadySelected
      ? selectedNames.filter((name) => name !== item.name)
      : [...selectedNames, item.name];

    setFilters((prev) => ({
      ...prev,
      solicitationType: updated,
    }));
  };

  const removeSelected = (name) => {
    const updated = selectedNames.filter((n) => n !== name);
    setFilters((prev) => ({
      ...prev,
      solicitationType: updated,
    }));
  };

  const handleCancel = () => {
    setFilters((prev) => ({
      ...prev,
      solicitationType: "",
    }));
    onApply?.();
  };

  const handleApply = () => {
    onApply?.();
  };

  const isAllSelected = selectedNames.length === options.length;

  const toggleAll = () => {
    if (isAllSelected) {
      setFilters((prev) => ({ ...prev, solicitationType: "" }));
    } else {
      const allNames = options.map((item) => item.name);
      setFilters((prev) => ({ ...prev, solicitationType: allNames }));
    }
  };

  // ✅ Filtered data based on search term
  const filteredOptions = options.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      <div className="">
        {/* Search Bar */}
      <div className="flex justify-end mb-8">
        <div className="relative w-[340px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // ✅ On change handler
            placeholder="Search titles or organization or location"
            className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
        </div>
      </div>

      {/* Selected */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-p font-medium">
          Selected Types <span className="text-primary">({selectedNames.length})</span>
        </h2>
        {selectedNames.length > 0 && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, solicitationType: "" }))}
            className="text-lg underline font-inter"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {selectedNames.map((name) => (
          <div
            key={name}
            className="flex border-[2px] gap-3 px-5 rounded-[30px] border-primary items-center justify-between text-lg py-2 font-inter"
          >
            <div>{name}</div>
            <button onClick={() => removeSelected(name)} className="text-primary">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Bid Types Box */}
      <div className="border-[#273BE280] border-[2px] rounded-[10px] mt-6">
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#273BE280]">
          <div className="flex items-center space-x-2">
            {/* <input
              type="checkbox"
              className="accent-[#273BE280]"
              checked={isAllSelected}
              onChange={toggleAll}
            /> */}
            <span className="text-p font-medium font-inter">Bid Types</span>
          </div>
          {/* <button onClick={toggleAll} className="text-xl underline">
            {isAllSelected ? "Clear All" : "Select All"}
          </button> */}
        </div>

        {/* Filtered Options */}
        <div className="divide-y divide-[#273BE280]">
          {filteredOptions.map((item) => (
            <label
              key={item.name}
              className="flex items-center px-4 py-2 cursor-pointer text-[22px] font-inter"
            >
              <input
                type="checkbox"
                className="accent-[#273BE280] mr-3"
                checked={selectedNames.includes(item.name)}
                onChange={() => toggleSelect(item)}
              />
              <span className="text-sm text-gray-800">{item.name}</span>
            </label>
          ))}
        </div>
      </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 p-5 ps-0 bg-white sticky bottom-0">
        <button
          onClick={handleCancel}
          className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SolicitationTypeTab;