import React, { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import api from "../../utils/axios";

const UNSPSCCode = ({ filters, setFilters, onApply }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [unspscData, setUnspscData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Array of selected codes only, as string[]
  const selectedCodes = filters.unspsc_codes || [];

  // 1️⃣ Update selected unspsc_codes (as plain string array)
  const updateSelected = (updatedCodes) => {
    setFilters((prev) => ({ ...prev, unspsc_codes: updatedCodes }));
  };

  // 2️⃣ Toggle individual code
  const toggleSelect = (code) => {
    const updated = selectedCodes.includes(code)
      ? selectedCodes.filter((c) => c !== code)
      : [...selectedCodes, code];
    updateSelected(updated);
  };

  // 3️⃣ Remove code
  const removeSelected = (code) => {
    updateSelected(selectedCodes.filter((c) => c !== code));
  };

  // 4️⃣ Toggle entire category
  const toggleAllItems = (category) => {
    const allCodes = category.children?.map((child) => child.code) || [];
    const allSelected = allCodes.every((code) => selectedCodes.includes(code));
    const updated = allSelected
      ? selectedCodes.filter((code) => !allCodes.includes(code))
      : [...new Set([...selectedCodes, ...allCodes])];
    updateSelected(updated);
  };

  // 5️⃣ Fetch UNSPSC list from API
  useEffect(() => {
    const fetchUNSPSC = async () => {
      try {
        setLoading(true);
        const res = await api.get("/bids/unspsc-codes/");
        setUnspscData(res.data.results || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load UNSPSC codes.");
      } finally {
        setLoading(false);
      }
    };

    fetchUNSPSC();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      <div className="">
        {/* 🔍 Search */}
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

      {/* 🟦 Selected */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-p font-medium">
          Selected Codes <span className="text-primary">({selectedCodes.length})</span>
        </h2>
        {selectedCodes.length > 0 && (
          <button onClick={() => updateSelected([])} className="text-lg underline font-inter">
            Clear All
          </button>
        )}
      </div>

      {/* 🧾 Render selected items */}
      {selectedCodes.map((code) => (
        <div key={code} className="flex items-center justify-between text-sm py-2 border-b font-inter">
          <div className="font-medium text-lg">{code}</div>
          <button onClick={() => removeSelected(code)} className="text-primary ml-4">
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {/* 📦 Render categories */}
      <div className="border-[#273BE280] border-[2px] rounded-[10px] mt-6">
        <div className="font-semibold text-md p-2 border-b">Categories</div>

        {loading && <p className="p-4 text-gray-500">Loading...</p>}
        {error && <p className="p-4 text-red-500">{error}</p>}

        {!loading && !error && unspscData.map((cat) => {
          const allSelected = cat.children?.every((child) => selectedCodes.includes(child.code));

          return (
            <div key={cat.code}>
              <div
                onClick={() => setActiveCategory((prev) => (prev === cat.code ? null : cat.code))}
                className="flex items-center font-inter text-xl w-full px-4 py-3 border-t-[2px] border-[#273BE280] cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-3 accent-primary mt-1"
                  checked={allSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleAllItems(cat);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="text-primary w-6">
                  {cat.children && (
                   <i className={`fas fa-chevron-${activeCategory === cat.code ? "down" : "right"}`} />

                  )}
                </div>
                <div className="w-20 font-semibold">{cat.code}</div>
                <div className="font-medium">{cat.name}</div>
              </div>

              {/* 🔽 Expand children */}
              {activeCategory === cat.code && (
                <div>
                  {cat.children?.map((child) => (
                    <label
                      key={child.code}
                      className="flex items-center gap-5 py-2 cursor-pointer font-inter px-8 text-xl border-t-[2px] border-[#273BE280]"
                      htmlFor={child.code}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 accent-primary"
                        checked={selectedCodes.includes(child.code)}
                        onChange={() => toggleSelect(child.code)}
                         id={child.code}
                      />
                      <div className="font-semibold text-lg">{child.code}</div>
                      <div className="text-[16px]">
                        <div>{child.name}</div>
                        <div>{child.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>

      {/* 🟩 Buttons */}
      <div className="flex gap-4 p-5 ps-0 bg-white sticky bottom-0">
        <button
          className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
          onClick={() => onApply()}
        >
          Cancel
        </button>
        <button
          className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
          onClick={() => onApply()}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default UNSPSCCode;