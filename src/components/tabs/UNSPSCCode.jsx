import React, { useEffect, useState } from "react";
import { Trash2, Search } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getUNSPSCCodes } from "../../services/user.service.js";



const UNSPSCCode = ({ 
  filters = {}, 
  setFilters = () => {}
}) => {
  const [selected, setSelected] = useState(filters.UNSPSCCode || []);
  const [unspscData, setUnspscData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    page_size: 10,
    total_pages: 0,
    hasMore: true,
  });

  const toggleSelect = (item) => {
    const exists = selected.find((s) => s.code === item.code);
    const updated = exists
      ? selected.filter((s) => s.code !== item.code)
      : [...selected, item];

    setSelected(updated);
    setFilters({ ...filters, UNSPSCCode: updated });
  };

  const removeSelected = (code) => {
    const updated = selected.filter((item) => item.code !== code);
    setSelected(updated);
    setFilters({ ...filters, UNSPSCCode: updated });
  };

  const clearAllSelected = () => {
    setSelected([]);
    setFilters({ ...filters, UNSPSCCode: [] });
  };

   const fetchDescriptionsForSelectedCodes = async (codes) => {
    const codesWithoutDesc = codes.filter(item => !item.description || item.description === "");
    
    if (codesWithoutDesc.length === 0) return codes;

    try {
      // Fetch descriptions for codes that don't have them
      const updatedCodes = await Promise.all(codes.map(async (item) => {
        if (!item.description || item.description === "") {
          try {
            const response = await getUNSPSCCodes({ code: item.code });
            if (response && response.results && response.results.length > 0) {
              return {
                ...item,
                description: response.results[0].description || "No description"
              };
            }
          } catch (error) {
            console.warn(`Could not fetch description for code ${item.code}`);
          }
        }
        return item;
      }));
      
      return updatedCodes;
    } catch (error) {
      console.error("Error fetching descriptions:", error);
      return codes.map(item => ({
        ...item,
        description: item.description || "No description"
      }));
    }
  };

   useEffect(() => {
    if (filters.UNSPSCCode && Array.isArray(filters.UNSPSCCode)) {
      // Check if any selected codes are missing descriptions
      const needsDescriptions = filters.UNSPSCCode.some(item => !item.description || item.description === "");
      
      if (needsDescriptions) {
        // Fetch descriptions for codes without them
        fetchDescriptionsForSelectedCodes(filters.UNSPSCCode).then(updatedCodes => {
          setSelected(updatedCodes);
          // Update filters with descriptions - but don't create infinite loop
          if (JSON.stringify(updatedCodes) !== JSON.stringify(filters.UNSPSCCode)) {
            setFilters({ ...filters, UNSPSCCode: updatedCodes });
          }
        });
      } else {
        setSelected(filters.UNSPSCCode);
      }
    }
  }, [filters.UNSPSCCode]);
  const fetchData = async (page = 1, append = false, currentSearch = "") => {
    try {
      if (page === 1) setLoading(true);

      const requestParams = {
        page,
        pageSize: 10,
      };

      // Use 'code' parameter for exact search instead of 'search'
      if (currentSearch) {
        requestParams.code = currentSearch; // Changed to 'code' for exact match
      }

      const response = await getUNSPSCCodes(requestParams);
      const { count, page: currentPage, page_size, total_pages, results } = response;

      // NO SORTING - Use results as they come from API for exact match
      setUnspscData((prevData) =>
        append ? [...prevData, ...results] : results
      );

      setPagination({
        count,
        page: currentPage,
        page_size,
        total_pages,
        hasMore: currentPage < total_pages,
      });
    } catch (error) {
      console.error("Error fetching UNSPSC codes:", error);
      if (page === 1) {
        let filteredMockData = [];
        
        if (currentSearch) {
          // EXACT match only in mock data - no partial matches
          filteredMockData = MOCK_DATA.filter(item => 
            item.code === currentSearch // Only exact match
          );
        } else {
          filteredMockData = MOCK_DATA;
        }

        setUnspscData(filteredMockData);
        setPagination({
          count: filteredMockData.length,
          page: 1,
          page_size: filteredMockData.length,
          total_pages: 1,
          hasMore: false,
        });
      }
    } finally {
      if (page === 1) setLoading(false);
    }
  };

  const fetchMoreData = () => {
    if (pagination.hasMore) {
      fetchData(pagination.page + 1, true, searchTerm);
    }
  };

  useEffect(() => {
    fetchData(1, false, searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchTerm(value);
  };

  console.log(filters," selected UNSPSC codes ...........................................................", selected);

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14 overflow-y-auto">
      <div>
        {/* Search Bar */}
        <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search by code or description"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
              size={18}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
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
                className="text-lg underline font-inter text-blue-500 hover:text-blue-700"
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
              className="text-blue-500 ml-4 hover:text-blue-600"
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
              <div className="text-lg font-inter text-gray-500">
                {searchTerm 
                  ? "Not Available"
                  : "No UNSPSC codes available"
                }
              </div>
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
                      className="flex items-center gap-5 py-2 cursor-pointer font-inter px-8 text-xl border-t-[2px] border-[#273BE280] hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 accent-primary"
                        checked={isSelected}
                        onChange={() => toggleSelect(cat)}
                      />
                      <div className="font-semibold text-lg">
                        {cat.code}
                      </div>
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