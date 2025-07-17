import React, { useEffect, useState } from "react";
import { Trash2, Search } from "lucide-react";
import api from "../../utils/axios";

const LocationTab = ({ filters = {}, setFilters = () => {}, onApply = () => {} }) => {
  const [statesData, setStatesData] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/auth/states/");
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setStatesData(sorted);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  const selectedNames = filters.location
    ? filters.location.split(",").map((name) => name.trim())
    : [];

  const selected = statesData.filter((state) =>
    selectedNames.includes(state.name)
  );

  const toggleSelect = (state) => {
    const isAlreadySelected = selectedNames.includes(state.name);
    const updatedNames = isAlreadySelected
      ? selectedNames.filter((name) => name !== state.name)
      : [...selectedNames, state.name];

    setFilters((prev) => ({
      ...prev,
      location: updatedNames.join(","),
    }));
  };

  const removeSelected = (name) => {
    const updated = selectedNames.filter((n) => n !== name);
    setFilters((prev) => ({
      ...prev,
      location: updated.join(","),
    }));
  };

  const handleCancel = () => {
    setFilters((prev) => ({ ...prev, location: "" }));
    onApply?.();
  };

  const handleApply = () => {
    onApply?.();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      <div className="flex justify-end mb-8">
        <div className="relative w-[340px]">
          <input
            type="text"
            placeholder="Search titles or organization or location"
            className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
        </div>
      </div>

      {/* Selected */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-p font-medium">
          Selected States <span className="text-primary">({selected.length})</span>
        </h2>
        {selected.length > 0 && (
          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, location: "" }))
            }
            className="text-lg underline font-inter"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {selected.map((item) => (
          <div
            key={item.name}
            className="flex border-[2px] gap-3 px-5 rounded-[30px] border-primary items-center justify-between text-lg py-2 font-inter"
          >
            <div>{item.name}</div>
            <button onClick={() => removeSelected(item.name)} className="text-primary">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* States List */}
      <div className="border-[#273BE280] border-[2px] rounded-[10px] mt-6">
        <div className="font-semibold text-md p-2 border-b">States</div>
        {statesData.map((state) => (
          <label
            key={state.name}
            className="flex items-center gap-5 py-2 cursor-pointer font-inter px-4 text-xl border-[#273BE280] border-t-[2px]"
          >
            <input
              type="checkbox"
              className="mt-1 accent-primary"
              checked={selectedNames.includes(state.name)}
              onChange={() => toggleSelect(state)}
            />
            <div className="text-[16px]">{state.name}</div>
          </label>
        ))}
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

export default LocationTab;