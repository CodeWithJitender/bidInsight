import React, { useEffect, useState } from "react";
import { Trash2, Search } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getUNSPSCCodes } from "../../services/bid.service.js";

const MOCK_DATA = [
  { code: "10000000", description: "Live Plant and Animal Material" },
  { code: "10100000", description: "Live animals" },
  { code: "10101500", description: "Livestock" },
  { code: "10101600", description: "Poultry" },
  { code: "10101700", description: "Aquatic animals" },
  { code: "11000000", description: "Mineral and Textile Materials" },
  { code: "11100000", description: "Minerals" },
  { code: "11101500", description: "Metallic minerals" },
  { code: "11101600", description: "Non-metallic minerals" },
  { code: "12000000", description: "Chemical including Bio Chemicals" },
];

const UNSPSCCode = ({filters = {}, setFilters = () => {}}) => {
  const [selected, setSelected] = useState(filters.UNSPSCCode || []);
  const [unspscData, setUnspscData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    page_size: 10,
    total_pages: 0,
    hasMore: true
  });

  const toggleSelect = (item) => {
    const exists = selected.find((s) => s.code === item.code);
    const updated = exists
      ? selected.filter((s) => s.code !== item.code)
      : [...selected, item];
    
    setSelected(updated);
    // Update the filters with the new selection
    setFilters({
      ...filters,
      UNSPSCCode: updated
    });
  };

  const removeSelected = (code) => {
    const updated = selected.filter((item) => item.code !== code);
    setSelected(updated);
    // Update the filters when removing an item
    setFilters({
      ...filters,
      UNSPSCCode: updated
    });
  };

  const clearAllSelected = () => {
    setSelected([]);
    // Clear the filters as well
    setFilters({
      ...filters,
      UNSPSCCode: []
    });
  };

  // Sync local state with filters prop when filters change from outside
  React.useEffect(() => {
    if (filters.UNSPSCCode && Array.isArray(filters.UNSPSCCode)) {
      setSelected(filters.UNSPSCCode);
    }
  }, [filters.UNSPSCCode]);


  // console.log(filters)

  const fetchData = async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      
      const response = await getUNSPSCCodes({
        page: page,
        pageSize: 10,
        search: ""
      });
      const { count, page: currentPage, page_size, total_pages, results } = response;
      
      if (append) {
        // Append new data for infinite scroll
        setUnspscData(prevData => [...prevData, ...results]);
      } else {
        // Replace data for initial load
        setUnspscData(results);
      }
      
      setPagination({
        count,
        page: currentPage,
        page_size,
        total_pages,
        hasMore: currentPage < total_pages
      });
      
    } catch (error) {
      console.error("Error fetching UNSPSC codes:", error);
      if (page === 1) {
        // Fallback to mock data if initial API call fails
        setUnspscData(MOCK_DATA);
        setPagination({
          count: MOCK_DATA.length,
          page: 1,
          page_size: MOCK_DATA.length,
          total_pages: 1,
          hasMore: false
        });
      }
    } finally {
      if (page === 1) setLoading(false);
    }
  };

  const fetchMoreData = () => {
    if (pagination.hasMore) {
      fetchData(pagination.page + 1, true);
    }
  };

  useEffect(() => {
    fetchData(1, false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14 overflow-y-auto">
      <div>
        {/* Search Bar (non-functional) */}
        <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search by code or description"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
              size={18}
            />
          </div>
        </div>

        {/* Selected Items */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-p font-medium font-inter">
            Selected UNSPSC Codes{" "}
            <span className="text-primary">({selected.length})</span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-inter">
              Total: {pagination.count} items
            </span>
            {selected.length > 0 && (
              <button
                onClick={clearAllSelected}
                className="text-lg underline font-inter"
              >
                Clear All
              </button>
            )}
          </div>
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

        {/* UNSPSC Codes List */}
        <div className="border-[#273BE280] border-[2px] rounded-[10px] mt-6">
          <div className="text-p font-medium font-inter border-b px-4 py-3">
            Available UNSPSC Codes
            <span className="text-sm text-gray-500 ml-2">
              (Page {pagination.page} of {pagination.total_pages})
            </span>
          </div>
          {loading ? (
            <div className="px-8 py-4 text-center">
              <div className="text-lg font-inter">Loading UNSPSC codes...</div>
            </div>
          ) : unspscData.length === 0 ? (
            <div className="px-8 py-4 text-center">
              <div className="text-lg font-inter text-gray-500">No UNSPSC codes available</div>
            </div>
          ) : (
            <div id="scrollableDiv" style={{ height: '400px', overflow: 'auto' }}>
              <InfiniteScroll
                dataLength={unspscData.length}
                next={fetchMoreData}
                hasMore={pagination.hasMore}
                loader={
                  <div className="px-8 py-4 text-center">
                    <div className="text-lg font-inter text-primary">Loading more...</div>
                  </div>
                }
                endMessage={
                  <div className="px-8 py-4 text-center">
                    <div className="text-sm font-inter text-gray-500">
                      All {pagination.count} UNSPSC codes loaded
                    </div>
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                {unspscData.map((cat) => {
                  const isSelected = selected.some((item) => item.code === cat.code);
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
          )}
        </div>
      </div>

      
    </div>
  );
};

export default UNSPSCCode;
