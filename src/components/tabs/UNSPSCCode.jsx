import React, { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../../utils/axios";

const UNSPSCCode = ({
  filters = {},
  setFilters = () => { },
  searchOption = "create",
  selectedSavedSearch = {},
  defaultSearch = false,
  setShowValidation = () => { },
  setTriggerSave = () => { },
  setActiveTab = () => { },
  onSubmit = () => { },
  onApply = () => { },
}) => {
  const [unspscData, setUnspscData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const selected = filters.unspsc_codes || [];

  const updateSelected = (updatedList) => {
    setFilters((prev) => ({ ...prev, unspsc_codes: updatedList }));
  };

  const toggleSelect = (item) => {
    const exists = selected.find((s) => s.code === item.code);
    const updated = exists
      ? selected.filter((s) => s.code !== item.code)
      : [...selected, item];
    updateSelected(updated);
  };

  const removeSelected = (code) => {
    const updated = selected.filter((item) => item.code !== code);
    updateSelected(updated);
  };

  const fetchUNSPSC = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const res = await api.get("/bids/unspsc-codes/", {
        params: {
          page: pageNum,
          page_size: 20,
          code: searchQuery || undefined,
        },
      });

      const results = res.data.results || [];
      setUnspscData((prev) => (append ? [...prev, ...results] : results));
      setHasMore(results.length > 0);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load UNSPSC codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchUNSPSC(1, false);
  }, [searchQuery]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    fetchUNSPSC(nextPage, true);
    setPage(nextPage);
  };

  // 🔁 Normalize saved filters if they are string codes
  useEffect(() => {
    if (
      filters.unspsc_codes?.length &&
      typeof filters.unspsc_codes[0] === "string" &&
      unspscData.length
    ) {
      const matched = filters.unspsc_codes
        .map((code) => unspscData.find((d) => d.code === code))
        .filter(Boolean);
      if (matched.length) {
        setFilters((prev) => ({
          ...prev,
          unspsc_codes: matched,
        }));
      }
    }
  }, [filters.unspsc_codes, unspscData]);

  const handleCancel = () => {
    setFilters((prev) => ({ ...prev, unspsc_codes: [] }));

    if (searchOption === "create") {
      setActiveTab("Save Search Form");
      setTimeout(() => setTriggerSave(true), 0);
    } else {
      onApply?.();
    }
  };

  const handleApply = () => {
    const isCreate = searchOption === "create";
    const isReplace = searchOption === "replace";
    const nameMissing = !filters.searchName?.trim();

    if (isCreate && nameMissing) {
      setShowValidation(true);
      setActiveTab("Save Search Form");
      return;
    }

    if (isCreate) {
      setTriggerSave(true); // parent will handle save
    } else if (isReplace) {
      const payload = {
        action: "replace",
        name: selectedSavedSearch?.name,
        id: selectedSavedSearch?.id,
        isDefault: defaultSearch,
        filters: { ...filters },
      };
      onSubmit?.(payload);
      setShowValidation(false);
    } else {
      onApply?.();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14 overflow-y-auto">
      <div>
        {/* Search Box */}
        <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search by code or description"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            Selected UNSPSC Codes{" "}
            <span className="text-primary">({selected.length})</span>
          </h2>
          {selected.length > 0 && (
            <button
              onClick={() => updateSelected([])}
              className="text-lg underline font-inter"
            >
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
              <div>{item.description || "No description"}</div>
            </div>
            <button
              onClick={() => removeSelected(item.code)}
              className="text-primary ml-4"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {/* UNSPSC List */}
        {/* UNSPSC List */}
        <div
          className="border-[#273BE280] border-[2px] rounded-[10px] mt-6"
          id="unspsc-scroll"
          style={{
            height: "500px", // ✅ Fixed height ensures scroll works for InfiniteScroll
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div className="text-p font-medium font-inter border-b px-4 py-3">
            Available UNSPSC Codes
          </div>
          <InfiniteScroll
            dataLength={unspscData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <p className="p-4 text-center text-gray-500">
                <img className="w-20 mx-auto" src="/loadunspsccccc.gif" alt="loading" />
              </p>
            }
            endMessage={
              <p className="p-4 text-center text-gray-400">No more results</p>
            }
            scrollableTarget="unspsc-scroll"
          >
            {unspscData.map((cat) => {
              const isSelected = selected.some(
                (item) =>
                  (typeof item === "string" && item === cat.code) ||
                  item.code === cat.code
              );
              return (
                <label
                  key={cat.code}
                  className="flex items-center gap-5 py-2 cursor-pointer font-inter px-8 text-xl border-t-[2px] border-[#273BE280]"
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-primary"
                    checked={isSelected}
                    onChange={() => toggleSelect(cat)}
                  />
                  <div className="font-semibold text-lg">{cat.code}</div>
                  <div className="text-[16px]">
                    {cat.description || "No description"}
                  </div>
                </label>
              );
            })}
          </InfiniteScroll>
        </div>

      </div>

      {/* Bottom Buttons */}
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

export default UNSPSCCode;