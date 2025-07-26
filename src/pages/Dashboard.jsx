import React, { useState, useEffect, useRef, useCallback } from "react";
import AlertToggle from "../components/AlertToggle";
import HeroHeading from "../components/HeroHeading";
import BgCover from "../components/BgCover";
import BidTable from "../components/BidTable";
import Pagination from "../components/Pagination";
import FilterPanel from "../components/FilterPanel";
import FilterPanelSaveSearch from "../components/FilterPanelSaveSearch";
import api from "../utils/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getBids } from "../services/bid.service";
import { useDispatch, useSelector } from "react-redux";
import { setBids } from "../redux/reducer/bidSlice";

function Dashboard() {
  const data = { title: "Dashboard" };
  const perPage = 25;
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef();
  const bidsSectionRef = useRef(null);

  // State variables
  // const [bids, setBids] = useState([]);

  const dispatch = useDispatch();
  const { bidsInfo } = useSelector((state) => state.bids);
  const [savedSearches, setSavedSearches] = useState([]);
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(null);

  const [filters, setFilters] = useState({
    status:"",
    keyword:{
      include: [],
      exclude: [],
    },
    location:[],
    UNSPSCCode:[],
    solicitationType:[],
  });
  const [saveSearchFilters, setSaveSearchFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  // Function to decode URL parameters and populate filters (same as FilterPanel)
  const decodeUrlToFilters = (searchParams) => {
    const decodedFilters = {
      status: "",
      keyword: {
        include: [],
        exclude: [],
      },
      location: [],
      UNSPSCCode: [],
      solicitationType: [],
    };

    if (searchParams.get('bid_type')) {
      decodedFilters.status = searchParams.get('bid_type');
    }

    if (searchParams.get('state')) {
      decodedFilters.location = searchParams.get('state').split(',');
    }

    if (searchParams.get('solicitation')) {
      decodedFilters.solicitationType = searchParams.get('solicitation').split(',');
    }

    if (searchParams.get('include')) {
      decodedFilters.keyword.include = searchParams.get('include').split(',');
    }

    if (searchParams.get('exclude')) {
      decodedFilters.keyword.exclude = searchParams.get('exclude').split(',');
    }

    if (searchParams.get('unspsc_codes')) {
      const codes = searchParams.get('unspsc_codes').split(',');
      decodedFilters.UNSPSCCode = codes.map(code => ({ code: code }));
    }

    return decodedFilters;
  };

  // UseEffect to decode URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const hasFilterParams = searchParams.get('bid_type') || 
                           searchParams.get('state') || 
                           searchParams.get('solicitation') || 
                           searchParams.get('include') || 
                           searchParams.get('exclude') || 
                           searchParams.get('unspsc_codes');

    if (hasFilterParams) {
      const decodedFilters = decodeUrlToFilters(searchParams);
      setFilters(decodedFilters);
      setAppliedFilters(decodedFilters);
      console.log("Dashboard - Decoded filters from URL:", decodedFilters);
    }
  }, [location.search]);

  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [saveSearchToggle, setSaveSearchToggle] = useState(false);

  const [activeFilterTab, setActiveFilterTab] = useState("Status");
  const [searchOption, setSearchOption] = useState("create");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Summary data for dashboard middle section
  const middle = [
    { id: 2, title: "Active Bids", num: bidsInfo?.count || 0 },
    { id: 3, title: "New Bids", num: bidsInfo?.count || 0 },
    { id: 4, title: "Saved", num: "0" },
    { id: 5, title: "Followed", num: "0/25" },
  ];

  // Function to build query string from filters (same as FilterPanel)
  const buildQueryString = (filters) => {
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page', currentPage.toString());
    params.append('pageSize', perPage.toString());
    
    // Convert status (Active/Inactive)
    if (filters.status) {
      params.append('bid_type', filters.status);
    }
    
    // Convert location array to comma-separated state values
    if (filters.location && filters.location.length > 0) {
      params.append('state', filters.location.join(','));
    }
    
    // Convert solicitationType array to comma-separated solicitation values
    if (filters.solicitationType && filters.solicitationType.length > 0) {
      params.append('solicitation', filters.solicitationType.join(','));
    }
    
    // Convert keyword include array to comma-separated include values
    if (filters.keyword?.include && filters.keyword.include.length > 0) {
      params.append('include', filters.keyword.include.join(','));
    }
    
    // Convert keyword exclude array to comma-separated exclude values
    if (filters.keyword?.exclude && filters.keyword.exclude.length > 0) {
      params.append('exclude', filters.keyword.exclude.join(','));
    }
    
    // Convert UNSPSCCode array to comma-separated code values
    if (filters.UNSPSCCode && filters.UNSPSCCode.length > 0) {
      const codes = filters.UNSPSCCode.map(item => item.code);
      params.append('unspsc_codes', codes.join(','));
    }
    
    return params.toString();
  };

  // Function to fetch bids with applied filters
  const fetchBids = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("User not logged in");
      dispatch(setBids([]));
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      let queryString;
      
      // Check if we have applied filters
      const hasFilters = appliedFilters && (
        appliedFilters.status ||
        (appliedFilters.location && appliedFilters.location.length > 0) ||
        (appliedFilters.solicitationType && appliedFilters.solicitationType.length > 0) ||
        (appliedFilters.keyword?.include && appliedFilters.keyword.include.length > 0) ||
        (appliedFilters.keyword?.exclude && appliedFilters.keyword.exclude.length > 0) ||
        (appliedFilters.UNSPSCCode && appliedFilters.UNSPSCCode.length > 0)
      );

      if (hasFilters) {
        // Use filters to build query string
        queryString = buildQueryString(appliedFilters);
      } else {
        // Default query string with just pagination
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("pageSize", perPage);
        queryString = params.toString();
      }

      console.log("Fetching bids with query:", queryString);

      const res = await getBids(`?${queryString}`);
      
      console.log(res)
      
      // Store entire response in Redux
      dispatch(setBids(res));
    } catch (err) {
      console.error("Failed to fetch bids:", err);
      setError("Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  }, [currentPage, navigate, perPage, appliedFilters]);

  // Fetch bids on component mount and page change
  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  // Fetch saved searches on mount
  const fetchSavedSearches = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const res = await api.get("/bids/saved-filters/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedSearches(res.data);
    } catch (err) {
      console.error("Failed to fetch saved searches", err);
    }
  }, []);

  useEffect(() => {
    fetchSavedSearches();
  }, [fetchSavedSearches]);

  // Handle selecting a saved search and applying filters
  const handleSavedSearchSelect = async (searchId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await api.get("/bids/saved-filters/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const matched = res.data.find((item) => item.id === searchId);
      if (!matched) return;

      const urlParams = new URLSearchParams(matched.query_string);
      const filtersToUse = Object.fromEntries(urlParams.entries());

      setSelectedSavedSearch({ id: matched.id, name: matched.name });
      setSaveSearchFilters(filtersToUse);
      setFilters(filtersToUse);
      setAppliedFilters(filtersToUse);
      setCurrentPage(1);
      fetchBids(); // Refresh bids with new filters
    } catch (err) {
      console.error("Failed to load saved search filters", err);
    }
  };

  // Handle saving or updating a saved search (dummy stub for passing down)
  const handleSaveOrUpdate = (data) => {
    // Implement save/update logic or pass down to FilterPanelSaveSearch
    console.log("Save or Update called with data:", data);
  };

  // Pagination page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (bidsSectionRef.current) {
      bidsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Export bids handler
  const handleExport = () => {
    if (tableRef.current) {
      tableRef.current.exportToCSV();
    }
  };

  // Toggle filter panel visibility
  const handleOpenFilter = () => {
    setActiveFilterTab("Status");
    setSidebarToggle(true);
  };

  return (
    <>
      <div className="py-[120px] bg-blue">
        {sidebarToggle && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onClose={() => setSidebarToggle(false)}
            activeTab={activeFilterTab}
            setActiveTab={setActiveFilterTab}
            onApply={() => setSidebarToggle(false)}
          />
        )}

        {saveSearchToggle && (
          <FilterPanelSaveSearch
            filters={saveSearchFilters}
            setFilters={setSaveSearchFilters}
            onClose={() => setSaveSearchToggle(false)}
            onSave={handleSaveOrUpdate}
            selectedSearch={selectedSavedSearch}
            mode={searchOption}
            savedSearches={savedSearches}
            onApply={() => setSaveSearchToggle(false)}
          />
        )}

        <div className="container-fixed py-10 px-4">
          <div className="dashboard-header flex justify-between items-center">
            <HeroHeading data={data} />
            <div className="flex items-center gap-[15px]">
              <span className="font-inter text-[#DBDBDB]">Alert</span>
              <AlertToggle />
              <div className="search-box bg-btn p-4 px-6 flex gap-3 items-center rounded-[30px]">
                <i className="far text-white fa-search"></i>
                <input
                  type="text"
                  placeholder="Search titles or organization or location"
                  className="text-white bg-transparent w-[300px] border-none outline-none"
                  value="" // Controlled if you want to add search state
                  onChange={() => {}} // Add search handler if desired
                />
              </div>
            </div>
          </div>

          <div className="dashboard-middle">
            <div className="max-w-[1200px] py-[80px] flex justify-center mx-auto gap-8">
              {middle.map((item) => (
                <BgCover key={item.id}>
                  <div className="flex gap-4">
                    <div className="text font-inter text-[#DBDBDB]">{item.title}</div>
                    <p className="num font-inter font-bold text-white">{item.num}</p>
                  </div>
                </BgCover>
              ))}
            </div>
          </div>

          <div className="dashboard-feature">
            <div className="flex justify-between">
              <div className="feature-left">
                <div
                  className="bg-btn p-4 w-[56px] h-[56px] rounded-[16px] flex justify-center items-center cursor-pointer"
                  onClick={handleOpenFilter}
                  id="filter"
                >
                  <img
                    src={sidebarToggle ? "close.png" : "filter.png"}
                    className="w-6"
                    alt="Filter Toggle"
                  />
                </div>
              </div>

              <div className="feature-right">
                <div className="flex gap-4">
                  <div className="bg-btn p-4 rounded-[16px] cursor-pointer" onClick={handleExport} id="export">
                    <img src="export.png" className="w-6" alt="Export" />
                  </div>
                  <div className="saved-search bg-btn p-4 px-6 rounded-[30px] border-none font-inter font-medium">
                    <select
                      className="bg-transparent text-white focus:outline-none focus:ring-0"
                      value={selectedSavedSearch?.id || ""}
                      onChange={(e) => handleSavedSearchSelect(Number(e.target.value))}
                    >
                      <option value="_default_">My Saved Searches</option>
                      {savedSearches.map((search, index) => (
                        <option key={search.id || index} className="text-black" value={search.id}>
                          {search.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <BgCover>
                    <div
                      className="text-white cursor-pointer"
                      onClick={() => setSaveSearchToggle(true)}
                    >
                      Save Search
                    </div>
                  </BgCover>
                </div>
              </div>
            </div>
          </div>

          <div ref={bidsSectionRef}>
            {loading ? (
              <div className="text-white text-center py-10">Loading...</div>
            ) : error ? (
              <div className="text-red-400 text-center py-10">{error}</div>
            ) : (
              <BidTable bids={bidsInfo?.results || []} ref={tableRef} />
            )}

            <Pagination
              totalResults={bidsInfo?.count || 0}
              perPage={bidsInfo?.page_size || perPage}
              currentPage={bidsInfo?.page || currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard; 