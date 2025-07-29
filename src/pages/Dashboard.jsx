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
import { getBids, getSavedSearches } from "../services/bid.service";
import { useDispatch, useSelector } from "react-redux";
import { setBids } from "../redux/reducer/bidSlice";
import { addSavedSearch } from "../redux/reducer/savedSearchesSlice";

function Dashboard() {
  const data = { title: "Dashboard" };
  const perPage = 25;
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef();
  const bidsSectionRef = useRef(null);

  const dispatch = useDispatch();
  const { bidsInfo } = useSelector((state) => state.bids);
  // const [savedSearches, setSavedSearches] = useState([]);
  const { savedSearches } = useSelector((state) => state.savedSearches);
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  console.log(savedSearches);
  // 🔥 SINGLE SOURCE OF TRUTH - Remove duplicate filter states
  const [filters, setFilters] = useState({
    status: "Active",
    keyword: { include: [], exclude: [] },
    location: [],
    UNSPSCCode: [],
    NAICSCode: [],
    publishedDate: { after: "", before: "" },
    closingDate: { after: "", before: "" },
    solicitationType: [],
  });

  // 🔥 APPLIED FILTERS - Only these are used for API calls
  const [appliedFilters, setAppliedFilters] = useState({
    status: "Active",
    keyword: { include: [], exclude: [] },
    location: [],
    UNSPSCCode: [],
    NAICSCode: [],
    publishedDate: { after: "", before: "" },
    closingDate: { after: "", before: "" },
    solicitationType: [],
  });

  const [saveSearchFilters, setSaveSearchFilters] = useState({});
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [saveSearchToggle, setSaveSearchToggle] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("Status");
  const [searchOption, setSearchOption] = useState("create");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [topSearchTerm, setTopSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Summary data for dashboard middle section
  const middle = [
    { id: 2, title: "Active Bids", num: bidsInfo?.count || 0 },
    { id: 3, title: "New Bids", num: bidsInfo?.count || 0 },
    { id: 4, title: "Saved", num: "0" },
    { id: 5, title: "Followed", num: "0/25" },
  ];

  // 🔥 IMPROVED DECODE FUNCTION - Matches FilterPanel exactly
  const decodeUrlToFilters = (searchParams) => {
    const decodedFilters = {
      status: "",
      keyword: { include: [], exclude: [] },
      location: [],
      UNSPSCCode: [],
      solicitationType: [],
      NAICSCode: [],
      publishedDate: { after: "", before: "" },
      closingDate: { after: "", before: "" },
    };

    if (searchParams.get("bid_type")) {
      decodedFilters.status = searchParams.get("bid_type");
    }

    if (searchParams.get("state")) {
      decodedFilters.location = searchParams.get("state").split(",");
    }

    if (searchParams.get("solicitation")) {
      decodedFilters.solicitationType = searchParams
        .get("solicitation")
        .split(",");
    }

    if (searchParams.get("include")) {
      decodedFilters.keyword.include = searchParams.get("include").split(",");
    }

    if (searchParams.get("exclude")) {
      decodedFilters.keyword.exclude = searchParams.get("exclude").split(",");
    }

    if (searchParams.get("unspsc_codes")) {
      const codes = searchParams.get("unspsc_codes").split(",");
      decodedFilters.UNSPSCCode = codes.map((code) => ({ code }));
    }

    if (searchParams.get("naics_codes")) {
      const codes = searchParams.get("naics_codes").split(",");
      decodedFilters.NAICSCode = codes.map((code) => ({ code }));
    }

    if (searchParams.get("open_date_after")) {
      decodedFilters.publishedDate.after = searchParams.get("open_date_after");
    }

    if (searchParams.get("open_date_before")) {
      decodedFilters.publishedDate.before =
        searchParams.get("open_date_before");
    }

    if (searchParams.get("closing_date_after")) {
      decodedFilters.closingDate.after = searchParams.get("closing_date_after");
    }

    if (searchParams.get("closing_date_before")) {
      decodedFilters.closingDate.before = searchParams.get(
        "closing_date_before"
      );
    }

    return decodedFilters;
  };

  // 🔥 MAIN FIX - Proper URL decode on component mount and navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const hasFilterParams =
      searchParams.get("bid_type") ||
      searchParams.get("state") ||
      searchParams.get("solicitation") ||
      searchParams.get("include") ||
      searchParams.get("exclude") ||
      searchParams.get("unspsc_codes") ||
      searchParams.get("naics_codes") ||
      searchParams.get("open_date_after") ||
      searchParams.get("open_date_before") ||
      searchParams.get("closing_date_after") ||
      searchParams.get("closing_date_before");

    if (isInitialLoad) {
      // First load - check if URL has filters
      if (hasFilterParams) {
        // URL has filters - restore them
        const decodedFilters = decodeUrlToFilters(searchParams);
        console.log("🔥 Restoring filters from URL:", decodedFilters);
        setFilters(decodedFilters);
        setAppliedFilters(decodedFilters);
      } else {
        // No filters in URL - set defaults
        const defaultFilters = {
          status: "Active",
          keyword: { include: [], exclude: [] },
          location: [],
          UNSPSCCode: [],
          solicitationType: [],
          NAICSCode: [],
          publishedDate: { after: "", before: "" },
          closingDate: { after: "", before: "" },
        };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        navigate("/dashboard?page=1&pageSize=25&bid_type=Active", {
          replace: true,
        });
      }
      setIsInitialLoad(false);
    } else if (hasFilterParams) {
      // Subsequent navigation with filters - restore them
      const decodedFilters = decodeUrlToFilters(searchParams);
      console.log(
        "🔥 Navigation detected - restoring filters:",
        decodedFilters
      );
      setFilters(decodedFilters);
      setAppliedFilters(decodedFilters);
    }
  }, [location.search, navigate, isInitialLoad]);

  // Function to build query string from filters
  const buildQueryString = (filters) => {
    const params = new URLSearchParams();

    params.append("page", currentPage.toString());
    params.append("pageSize", perPage.toString());

    if (filters.status) {
      params.append("bid_type", filters.status);
    }

    if (filters.location && filters.location.length > 0) {
      params.append("state", filters.location.join(","));
    }

    if (filters.solicitationType && filters.solicitationType.length > 0) {
      params.append("solicitation", filters.solicitationType.join(","));
    }

    if (filters.keyword?.include && filters.keyword.include.length > 0) {
      params.append("include", filters.keyword.include.join(","));
    }

    if (filters.keyword?.exclude && filters.keyword.exclude.length > 0) {
      params.append("exclude", filters.keyword.exclude.join(","));
    }

    if (filters.UNSPSCCode && filters.UNSPSCCode.length > 0) {
      const codes = filters.UNSPSCCode.map((item) => item.code);
      params.append("unspsc_codes", codes.join(","));
    }

    if (filters.NAICSCode && filters.NAICSCode.length > 0) {
      const codes = filters.NAICSCode.map((item) => item.code);
      params.append("naics_codes", codes.join(","));
    }

    if (filters.publishedDate?.after) {
      params.append("open_date_after", filters.publishedDate.after);
    }

    if (filters.publishedDate?.before) {
      params.append("open_date_before", filters.publishedDate.before);
    }

    if (filters.closingDate?.after) {
      params.append("closing_date_after", filters.closingDate.after);
    }

    if (filters.closingDate?.before) {
      params.append("closing_date_before", filters.closingDate.before);
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
      // 🔥 FIXED: Check if any meaningful filters are applied
      const hasActiveFilters =
        appliedFilters.status !== "Active" ||
        (appliedFilters.location && appliedFilters.location.length > 0) ||
        (appliedFilters.solicitationType &&
          appliedFilters.solicitationType.length > 0) ||
        (appliedFilters.keyword?.include &&
          appliedFilters.keyword.include.length > 0) ||
        (appliedFilters.keyword?.exclude &&
          appliedFilters.keyword.exclude.length > 0) ||
        (appliedFilters.UNSPSCCode && appliedFilters.UNSPSCCode.length > 0) ||
        (appliedFilters.NAICSCode && appliedFilters.NAICSCode.length > 0) ||
        appliedFilters.publishedDate?.after ||
        appliedFilters.publishedDate?.before ||
        appliedFilters.closingDate?.after ||
        appliedFilters.closingDate?.before;

      const filtersToUse = hasActiveFilters
        ? appliedFilters
        : { ...appliedFilters, status: "Active" };

      const queryString = buildQueryString(filtersToUse);
      console.log("🔥 Fetching bids with query:", queryString);

      const res = await getBids(`?${queryString}`);
      dispatch(setBids(res));
    } catch (err) {
      console.error("Failed to fetch bids:", err);
      setError("Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  }, [currentPage, navigate, perPage, appliedFilters, dispatch]);

  // Fetch bids on component mount and page change
  useEffect(() => {
    if (!isInitialLoad) {
      fetchBids();
    }
  }, [fetchBids, isInitialLoad]);

  // 🔥 FILTER APPLY HANDLER - When filters are applied from FilterPanel
  const handleFiltersApply = (newFilters) => {
    console.log("🔥 Filters applied from FilterPanel:", newFilters);
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setCurrentPage(1); // Reset to first page

    // Build new URL with filters
    const queryString = buildQueryString(newFilters);
    navigate(`/dashboard?${queryString}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedSearches = await getSavedSearches();
        // console.log(savedSearches);
        // console.log("🔥 Fetched saved searches:", savedSearches);
        dispatch(addSavedSearch(savedSearches));
      } catch (error) {
        console.error("Error fetching saved searches:", error);
      }
    };

    fetchData();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (id) {
      setSelectedSavedSearch(
        savedSearches.find((search) => String(search.id) === String(id)) || null
      );
    } else {
      setSelectedSavedSearch(null);
    }
  }, [location.search, savedSearches]);

  // Handle selecting a saved search and applying filters
  const handleSavedSearchSelect = async (searchId) => {
    // 🔥 Handle "My Saved Searches" default option
    if (searchId === "_default_" || !searchId) {
      // Reset to default state
      const defaultFilters = {
        status: "Active",
        keyword: { include: [], exclude: [] },
        location: [],
        UNSPSCCode: [],
        solicitationType: [],
        NAICSCode: [],
        publishedDate: { after: "", before: "" },
        closingDate: { after: "", before: "" },
      };

      console.log("🔥 Resetting to default dashboard state");

      setFilters(defaultFilters);
      setAppliedFilters(defaultFilters);
      setSelectedSavedSearch(null);
      setSaveSearchFilters({});
      setCurrentPage(1);
      setTopSearchTerm(""); // Clear search input too

      // Navigate to default URL
      navigate("/dashboard?page=1&pageSize=25&bid_type=Active");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const matched = savedSearches.find((item) => item.id === searchId);
      if (!matched) return;

      const urlParams = new URLSearchParams(matched.query_string);
      const decodedFilters = decodeUrlToFilters(urlParams);

      setSelectedSavedSearch({ id: matched.id, name: matched.name });
      setSaveSearchFilters(matched.query_string);
      setFilters(decodedFilters);
      setAppliedFilters(decodedFilters);
      setCurrentPage(1);
      setTopSearchTerm(""); // Clear search input

      const fullURL = `/dashboard?page=1&pageSize=25${matched.query_string}&id=${matched.id}`;
      navigate(fullURL);
    } catch (err) {
      console.error("Failed to load saved search filters", err);
    }
  };

  // Handle saving or updating a saved search
  const handleSaveOrUpdate = (data) => {
    console.log("Save or Update called with data:", data);
  };

  // Pagination page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      if (bidsSectionRef.current) {
        bidsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
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

  // 🔥 REAL-TIME SEARCH FUNCTION
  const handleTopSearch = (searchTerm) => {
    const cleanedTerm = searchTerm.trim();

    // If empty search, reset to default filters
    if (!cleanedTerm) {
      const defaultFilters = {
        ...appliedFilters,
        keyword: { include: [], exclude: [] },
      };

      setFilters(defaultFilters);
      setAppliedFilters(defaultFilters);
      setCurrentPage(1);

      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("pageSize", perPage.toString());
      params.append("bid_type", defaultFilters.status || "Active");

      const queryString = params.toString();
      navigate(`/dashboard?${queryString}`);
      return;
    }

    // Create updated filters with the search term
    const updatedFilters = {
      ...appliedFilters,
      keyword: {
        ...appliedFilters.keyword,
        include: [cleanedTerm],
      },
    };

    console.log("🔥 Real-time search with term:", cleanedTerm);
    console.log("🔥 Updated filters:", updatedFilters);

    // Update both filter states
    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
    setCurrentPage(1);

    // Build query string with page reset
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("pageSize", perPage.toString());

    if (updatedFilters.status) {
      params.append("bid_type", updatedFilters.status);
    }

    if (updatedFilters.location && updatedFilters.location.length > 0) {
      params.append("state", updatedFilters.location.join(","));
    }

    if (
      updatedFilters.solicitationType &&
      updatedFilters.solicitationType.length > 0
    ) {
      params.append("solicitation", updatedFilters.solicitationType.join(","));
    }

    if (
      updatedFilters.keyword?.include &&
      updatedFilters.keyword.include.length > 0
    ) {
      params.append("include", updatedFilters.keyword.include.join(","));
    }

    if (
      updatedFilters.keyword?.exclude &&
      updatedFilters.keyword.exclude.length > 0
    ) {
      params.append("exclude", updatedFilters.keyword.exclude.join(","));
    }

    if (updatedFilters.UNSPSCCode && updatedFilters.UNSPSCCode.length > 0) {
      const codes = updatedFilters.UNSPSCCode.map((item) => item.code);
      params.append("unspsc_codes", codes.join(","));
    }

    if (updatedFilters.NAICSCode && updatedFilters.NAICSCode.length > 0) {
      const codes = updatedFilters.NAICSCode.map((item) => item.code);
      params.append("naics_codes", codes.join(","));
    }

    if (updatedFilters.publishedDate?.after) {
      params.append("open_date_after", updatedFilters.publishedDate.after);
    }

    if (updatedFilters.publishedDate?.before) {
      params.append("open_date_before", updatedFilters.publishedDate.before);
    }

    if (updatedFilters.closingDate?.after) {
      params.append("closing_date_after", updatedFilters.closingDate.after);
    }

    if (updatedFilters.closingDate?.before) {
      params.append("closing_date_before", updatedFilters.closingDate.before);
    }

    const queryString = params.toString();
    console.log("🔥 Navigating to:", `/dashboard?${queryString}`);

    navigate(`/dashboard?${queryString}`);
  };

  // 🔥 DEBOUNCED SEARCH HANDLER
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setTopSearchTerm(value);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      handleTopSearch(value);
    }, 500); // 500ms delay

    setSearchTimeout(newTimeout);
  };

  useEffect(()=>{
    const search = new  URLSearchParams(location.search).get("include");
    if( search && search.trim !== ""){
      setTopSearchTerm(search);
    }
    // console.log(search);
  },[location.search])

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
            onApply={handleFiltersApply} // 🔥 Pass the apply handler
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
            setSelectedSearch={setSelectedSavedSearch}
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
                  value={topSearchTerm}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-middle">
            <div className="max-w-[1200px] py-[80px] flex justify-center mx-auto gap-8">
              {middle.map((item) => (
                <BgCover key={item.id}>
                  <div className="flex gap-4">
                    <div className="text font-inter text-[#DBDBDB]">
                      {item.title}
                    </div>
                    <p className="num font-inter font-bold text-white">
                      {item.num}
                    </p>
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
                  <div
                    className="bg-btn p-4 rounded-[16px] cursor-pointer"
                    onClick={handleExport}
                    id="export"
                  >
                    <img src="export.png" className="w-6" alt="Export" />
                  </div>
                  <div className="saved-search bg-btn p-4 px-6 rounded-[30px] border-none font-inter font-medium">
                    <select
                      className="bg-transparent text-white focus:outline-none focus:ring-0"
                      value={selectedSavedSearch?.id || "_default_"}
                      onChange={(e) =>
                        handleSavedSearchSelect(
                          e.target.value === "_default_"
                            ? "_default_"
                            : Number(e.target.value)
                        )
                      }
                    >
                      <option value="_default_" className="text-black">
                        My Saved Searches
                      </option>
                      {savedSearches.map((search, index) => (
                        <option
                          key={search.id || index}
                          className="text-black"
                          value={search.id}
                        >
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
