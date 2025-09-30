import React, { useState, useEffect, useRef, useCallback } from "react";
import HeroHeading from "../components/HeroHeading";
import BgCover from "../components/BgCover";
import BidTable from "../components/BidTable";
import Pagination from "../components/Pagination";
import FilterPanel from "../components/FilterPanel";
import FilterPanelSaveSearch from "../components/FilterPanelSaveSearch";
import { useNavigate, useLocation } from "react-router-dom";
import { getBidCount, getBids, getSavedSearches, totalBookmarkedBids, exportBidsToCSV, followBids, totalFollowedBids } from "../services/bid.service";
import { useDispatch, useSelector } from "react-redux";
import { setBids } from "../redux/reducer/bidSlice";
import { addSavedSearch } from "../redux/reducer/savedSearchesSlice";
import ProfessionalSavedSearchDropdown from '../components/ProfessionalSavedSearchDropdown';
import StatShimmer from "../components/shimmereffects/StatShimmer";
import BidTableShimmer from "../components/shimmereffects/BidTableShimmer";
// import { useUserTimezone } from "../timezone/useUserTimezone";
import { fetchUserProfile } from "../redux/reducer/profileSlice";
import FeatureRestrictionPopup from "../components/FeatureRestrictionPopup";
import { deleteFollowedBid } from "../services/bid.service";
// 🔥 IMPORT URL HELPERS AND CONSTANTS
import { decodeUrlToFilters, buildQueryString } from "../utils/urlHelpers";
import { DASHBOARD_CONSTANTS } from "../utils/constants";
// Top imports me ye add karo
import { usePlan } from "../hooks/usePlan";
import DashboardStats from "../dashboard/DashboardStats";
import { useBookmarks } from "../dashboard/useBookmarks";
import { useFollowBids } from "../dashboard/useFollowBids";
// 🔥 IMPORT CUSTOM HOOKS
import { useSearchHandling } from "../hooks/useSearchHandling";
import { useFilterHandling } from "../hooks/useFilterHandling";
import { useDashboardUI } from "../hooks/useDashboardUI";

function Dashboard() {
  const perPage = DASHBOARD_CONSTANTS.PER_PAGE;
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef();
  const bidsSectionRef = useRef(null);
  const dispatch = useDispatch();
  const { bidsInfo } = useSelector((state) => state.bids);
  const { savedSearches } = useSelector((state) => state.savedSearches);
  // const { timezone: userTimezone } = useUserTimezone();

  // 🔥 USE CUSTOM HOOKS
  const {
    filters,
    setFilters,
    appliedFilters,
    setAppliedFilters,
    currentPage,
    setCurrentPage,
    isInitialLoad,
    handleFiltersApply,
    handleSort
  } = useFilterHandling(perPage);

  const {
    topSearchTerm,
    setTopSearchTerm,
    handleSearchInputChange
  } = useSearchHandling(appliedFilters, perPage);

  const showFeatureRestriction = (title, message, featureName = "Premium Feature", showUpgrade = true) => {
    setRestrictionPopup({
      isOpen: true,
      title,
      message,
      featureName,
      showUpgradeButton: showUpgrade
    });
  };

  const {
    planInfo,
    restrictions,
    validateAndExecute,
    isRestricted,
    blurConfig,
    shouldBlurBid,
    validateFeatureUsage
  } = usePlan();


  const {
    sidebarToggle,
    setSidebarToggle,
    saveSearchToggle,
    setSaveSearchToggle,
    activeFilterTab,
    setActiveFilterTab,
    searchOption,
    selectedSavedSearch,
    setSelectedSavedSearch,
    saveSearchFilters,
    setSaveSearchFilters,
    handleOpenFilter,
    handleSaveSearchClick
  } = useDashboardUI(restrictions, showFeatureRestriction);


  const [bidCount, setBidCount] = useState({ count: 0, new_bids: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortControllerRef = useRef(null);


  const [isBookmarkView, setIsBookmarkView] = useState(false);
  const [restrictionPopup, setRestrictionPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    featureName: "",
    showUpgradeButton: true
  });

  // 🚀 NEW STATE - Export Loading
  const [exportLoading, setExportLoading] = useState(false);
  const [isRestrictedFollowView, setIsRestrictedFollowView] = useState(false);

  // Existing states ke saath ye add karo
  const [isFollowView, setIsFollowView] = useState(false);

  const profile = useSelector((state) => state.profile.profile);
  const companyName = profile?.company_name || "";
  const formattedName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
  const data = { title: `${formattedName}'s Dashboard` };

  const closeFeatureRestriction = () => {
    setRestrictionPopup({
      isOpen: false,
      title: "",
      message: "",
      featureName: "",
      showUpgradeButton: true
    });
  };

  const handleUpgrade = () => {
    closeFeatureRestriction();
    navigate("/pricing"); // Navigate to pricing page
  };



  const {
    bookmarkedCount,
    bookmarkedBids,
    bookmarkLoading
  } = useBookmarks();

  const {
    followedBidsData,
    followedBids,
    followLoading,
    followedCount,
    handleFollowBid,
    handleUnfollowBid,
    refreshFollowedData
  } = useFollowBids(validateFeatureUsage, showFeatureRestriction);

  const getCurrentBidIds = () => {
    const currentBids = isBookmarkView ? bookmarkedBids : (bidsInfo?.results || []);
    return currentBids.map(bid => bid.id).filter(id => id);
  };

  const handleExport = useCallback(async () => {
    setExportLoading(true);

    try {
      const bidIds = getCurrentBidIds();

      if (bidIds.length === 0) {
        showFeatureRestriction(
          "No Data to Export",
          "No bids found to export. Please apply filters or search to display bids.",
          "Export Feature",
          false
        );
        setExportLoading(false);
        return;
      }

      // console.log("🔥 Exporting bid IDs:", bidIds);

      const result = await exportBidsToCSV(bidIds);

      if (result.success) {
        // console.log("✅ Export successful");
        // Optionally show success message
      } else if (result.error) {
        // Show restriction popup with backend error message
        showFeatureRestriction(
          result.title || "Export Failed",
          result.message || "Please upgrade your plan to export bids.",
          "Export Feature",
          result.needsUpgrade !== false
        );
      }

    } catch (error) {
      console.error("❌ Export error:", error);

      // Check if it's a plan restriction error
      if (error.response?.status === 403 || error.response?.data?.error) {
        showFeatureRestriction(
          error.response?.data?.title || "Export Failed",
          error.response?.data?.message || "Please upgrade your plan to export bids.",
          "Export Feature",
          true
        );
      } else {
        showFeatureRestriction(
          "Export Failed",
          "Something went wrong while exporting. Please try again.",
          "Export Feature",
          false
        );
      }
    } finally {
      setExportLoading(false);
    }
  }, [getCurrentBidIds, showFeatureRestriction]);
  // Dashboard.jsx - Updated handleFollowBid function



  const handleFollowedCardClick = async () => {
    if (restrictions?.follow) {
      showFeatureRestriction(
        " Follow Feature Locked",
        "Upgrade your plan to follow important bids and get instant notifications.",
        "Follow Feature",
        true
      );
      return;
    }

    // Real-time data refresh before navigation
    await refreshFollowedData(); // Ye line add karo

    setIsFollowView(true);
    setIsBookmarkView(false);
    setIsRestrictedFollowView(false);

    navigate("/dashboard/followedBids", { replace: false });
  };


  useEffect(() => {
    const handlePopState = (e) => {
      // console.log("🔥 Browser back/forward detected");

      // 🔥 READ CURRENT URL PARAMS
      const searchParams = new URLSearchParams(window.location.search);
      const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

      // 🔥 SYNC PAGE STATE WITH URL
      if (pageFromUrl !== currentPage) {
        // console.log(`🔥 Syncing page from browser navigation: ${pageFromUrl}`);
        setCurrentPage(pageFromUrl);
      }

      // 🔥 DECODE AND APPLY FILTERS FROM URL
      const decodedFilters = decodeUrlToFilters(searchParams);
      if (!decodedFilters.ordering) {
        decodedFilters.ordering = "closing_date";
      }

      setFilters(decodedFilters);
      setAppliedFilters(decodedFilters);

      // 🔥 SYNC SEARCH TERM
      const searchTerm = searchParams.get("search") || "";
      setTopSearchTerm(searchTerm);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage, setFilters, setAppliedFilters, setTopSearchTerm]);


  useEffect(() => {
    const fetchBidCount = async () => {
      try {
        const countData = await getBidCount();
        setBidCount(countData);
      } catch (error) {
        console.error("❌ Error fetching bid count:", error);
      }
    };
    fetchBidCount();
  }, []);



  // 🔥 FIX 2: Prevent auto-redirect on bookmark route refreshpaginat
  useEffect(() => {
    const isBookmarkRoute = location.pathname === '/dashboard/bookmarkBids';
    const isFollowRoute = location.pathname === '/dashboard/followedBids';

    setIsBookmarkView(isBookmarkRoute);
    setIsFollowView(isFollowRoute);

    if (isFollowRoute && restrictions?.follow) {
      setIsRestrictedFollowView(true);
      setLoading(false);
      return;
    } else {
      setIsRestrictedFollowView(false);
    }

    if (isBookmarkRoute || isFollowRoute) {
      setLoading(false);
      return;
    } else {
      const searchParams = new URLSearchParams(location.search);

      // console.log("🔥 All URL params:", Object.fromEntries(searchParams.entries()));
      // console.log("🔥 new_bids param:", searchParams.get('new_bids'));

      // YAH FIX KARO - URL se filters decode karo
      if (searchParams.toString() !== '') {
        const decodedFilters = decodeUrlToFilters(searchParams);
        if (!decodedFilters.ordering) {
          decodedFilters.ordering = "closing_date";
        }
        // console.log("🔥 Decoded filters:", decodedFilters);
        setFilters(decodedFilters);
        setAppliedFilters(decodedFilters);
      } else {
        const defaultFilters = { ...DASHBOARD_CONSTANTS.DEFAULT_FILTERS, ordering: "closing_date" };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
      }
    }
  }, [location.pathname, location.search, restrictions?.follow]);



  const fetchBids = useCallback(async () => {


    if (abortControllerRef.current) {
    console.log("🚫 Cancelling previous API call");
    abortControllerRef.current.abort();
  }

  // 🔥 STEP 2: Create new AbortController
  abortControllerRef.current = new AbortController();
  const signal = abortControllerRef.current.signal;

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
      const hasActiveFilters =
        appliedFilters.status !== "Active" ||
        // (appliedFilters.location?.length > 0) ||
        appliedFilters.new_bids ||
        (appliedFilters.location?.federal) ||
        (appliedFilters.location?.states?.length > 0) || // NEW: Check states array
        (appliedFilters.location?.local?.length > 0) ||  // NEW: Check local array
        (Array.isArray(appliedFilters.location) && appliedFilters.location.length > 0) ||
        (appliedFilters.solicitationType?.length > 0) ||
        (appliedFilters.keyword?.include?.length > 0) ||
        (appliedFilters.keyword?.exclude?.length > 0) ||
        (appliedFilters.UNSPSCCode?.length > 0) ||
        (appliedFilters.NAICSCode?.length > 0) ||
        appliedFilters.publishedDate?.after ||
        appliedFilters.publishedDate?.before ||
        appliedFilters.closingDate?.after ||
        appliedFilters.closingDate?.before ||
        appliedFilters.entityType;

      const filtersToUse = hasActiveFilters
        ? appliedFilters
        : { ...appliedFilters, status: "Active" };

      let queryString = buildQueryString(filtersToUse, currentPage, perPage);

      const searchParams = new URLSearchParams(location.search);
      const searchTermFromUrl = searchParams.get("search") || "";

      // console.log("🔥 Fetching bids with query:", queryString);

      const res = await getBids(`?${queryString}`, searchTermFromUrl, signal);
      console.log("🔥 API Response Data:", res);
      // console.log("🔥 Total Count:", response.data.count);
      console.log("🔥 URL Params:", window.location.search);

      console.log("🔥 Bids Count in Response:", res?.count);
      console.log("🔥 New Bids in URL:", searchParams.get('new_bids'));

     if (!signal.aborted) {
      dispatch(setBids(res));
      console.log("✅ Redux Updated Successfully");
    } else {
      console.log("⚠️ Request was cancelled, skipping Redux update");
    }


    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'canceled') {
      console.log("🚫 Request cancelled");
      return; // Don't show error for cancelled requests
    }
    
    console.error("❌ Failed to fetch bids:", err);
    setError("Failed to fetch bids");
    } finally {
       if (!abortControllerRef.current?.signal.aborted) {
      setLoading(false);
    }
    }
  }, [currentPage, navigate, perPage, appliedFilters, dispatch, location.search]);

  // 🔥 ENTITY TYPE CHANGE HANDLER
  const handleEntityTypeChange = useCallback((entityType) => {
    const updatedFilters = {
      ...appliedFilters,
      entityType: entityType,
      // location: entityType ? { federal: false, states: [], local: [] } : appliedFilters.location
    };

    if (entityType === "" || entityType === "Select Entity") {
      // Default pe jane pe sab clear kar do
      updatedFilters.location = {
        federal: false,
        states: [],
        local: []
      };
    } else {
      // Koi specific entity select karne pe bhi location reset kar do
      updatedFilters.location = {
        federal: entityType === "Federal",
        states: [],
        local: []
      };
    }

    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
    setCurrentPage(1);

    const searchParams = new URLSearchParams(location.search);
    const queryString = buildQueryString(updatedFilters, 1, perPage);

    // 🔥 Preserve saved search ID if it exists
    const savedSearchId = searchParams.get("id");

    // 🔥 IMPORTANT: Preserve search term from URL 
    const searchTerm = searchParams.get("search");

    // 🔥 Build final URL with preserved parameters
    let finalURL = `/dashboard?${queryString}`;

    const additionalParams = new URLSearchParams();

    if (savedSearchId) {
      additionalParams.set("id", savedSearchId);
    }

    // 🔥 Preserve search term in URL
    if (searchTerm) {
      additionalParams.set("search", searchTerm);
    }

    if (additionalParams.toString()) {
      finalURL += `&${additionalParams.toString()}`;
    }

    navigate(finalURL);
  }, [appliedFilters, location.search, perPage, navigate]);

  // 🔥 FETCH BIDS ON LOAD
  useEffect(() => {
    if (!isInitialLoad && !isBookmarkView && !isFollowView && !isRestrictedFollowView) {
      fetchBids();
    }
  }, [fetchBids, isInitialLoad, isBookmarkView, isFollowView, isRestrictedFollowView]);

  useEffect(() => {
    console.log("🔥 Dashboard Debug Info:");
    console.log("Current route:", location.pathname);
    console.log("isBookmarkView:", isBookmarkView);
    console.log("bookmarkedBids:", bookmarkedBids);
    console.log("bidsInfo?.results:", bidsInfo?.results);
    console.log("Data being passed to BidTable:", isBookmarkView ? bookmarkedBids : (bidsInfo?.results || []));
  }, [location.pathname, isBookmarkView, bookmarkedBids, bidsInfo]);

  // 🔥 HANDLE SAVED SEARCH SELECTION FROM URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const savedSearchId = searchParams.get("id");

    if (savedSearchId && savedSearches.length > 0) {
      // ✅ ADD: Skip if already processing same search
      if (selectedSavedSearch?.id?.toString() === savedSearchId) {
        // console.log("🔄 Same search already selected in useEffect, skipping");
        return;
      }

      const matchedSearch = savedSearches.find((item) => item.id.toString() === savedSearchId);

      if (matchedSearch) {
        // console.log("✅ Found matching saved search:", matchedSearch.name);

        const searchObject = {
          id: matchedSearch.id,
          name: matchedSearch.name,
          query_string: matchedSearch.query_string
        };

        setSelectedSavedSearch(searchObject);

        const urlParams = new URLSearchParams(matchedSearch.query_string);
        const decodedFilters = decodeUrlToFilters(urlParams);

        if (!decodedFilters.ordering) {
          decodedFilters.ordering = "closing_date";
        }

        // console.log("✅ Applying filters from saved search:", decodedFilters);
        setFilters(decodedFilters);
        setAppliedFilters(decodedFilters);

        const searchTerm = urlParams.get("search");
        if (searchTerm) {
          setTopSearchTerm(searchTerm);
        }

      } else {
        console.log("❌ No matching saved search found for ID:", savedSearchId);
      }
    } else if (!savedSearchId && selectedSavedSearch) {
      // ✅ IMPROVED: Only clear if currently selected
      console.log("🧹 Clearing saved search selection - no ID in URL");
      setSelectedSavedSearch(null);
    }
  }, [location.search, savedSearches, setFilters, setAppliedFilters, setTopSearchTerm]);


  // 🔥 FETCH SAVED SEARCHES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedSearches = await getSavedSearches();
        // console.log("🔥 Fetched saved searches:", savedSearches);
        dispatch(addSavedSearch(savedSearches));
      } catch (error) {
        console.error("Error fetching saved searches:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  // 🔥 FETCH USER PROFILE
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    // 🔥 SYNC PAGE FROM URL ON ROUTE CHANGES
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    // 🔥 ONLY UPDATE IF DIFFERENT TO AVOID INFINITE LOOPS
    if (pageFromUrl !== currentPage) {
      // console.log(`🔥 Syncing page from URL: ${pageFromUrl}`);
      setCurrentPage(pageFromUrl);
    }
  }, [location.search]);

  // 🔥 SAVED SEARCH SELECT HANDLER
  const enhancedHandleSavedSearchSelect = useCallback(async (searchId) => {
    // Check restriction first
    if (restrictions?.savedSearch) {
      showFeatureRestriction(
        " Saved Search Locked",
        "Upgrade your plan to access and manage your saved searches.",
        "Saved Search Feature",
        true
      );
      return;
    }

    // Original logic
    if (searchId === "_default_" || !searchId) {
      const defaultFilters = { ...DASHBOARD_CONSTANTS.DEFAULT_FILTERS, ordering: "closing_date" };

      // console.log("🔥 Resetting to default dashboard state");

      setFilters(defaultFilters);
      setAppliedFilters(defaultFilters);
      setSelectedSavedSearch(null);
      setSaveSearchFilters({});
      setCurrentPage(1);
      setTopSearchTerm("");

      navigate("/dashboard?page=1&pageSize=25&bid_type=Active&ordering=closing_date", { replace: true });
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const matched = savedSearches.find((item) => item.id === searchId);
      // console.log(matched?.query_string, "🔥 Matched saved search");
      if (!matched) return;

      if (selectedSavedSearch?.id === matched.id) {
        // console.log("🔄 Same search already selected, skipping duplicate processing");
        return;
      }

      const urlParams = new URLSearchParams(matched.query_string);
      const decodedFilters = decodeUrlToFilters(urlParams);

      if (!decodedFilters.ordering) {
        decodedFilters.ordering = "closing_date";
      }
      // console.log(decodedFilters, "🔥 Decoded filters from saved search");

      setSelectedSavedSearch({
        id: matched.id,
        name: matched.name,
        query_string: matched.query_string
      });

      setSaveSearchFilters(matched.query_string);
      setFilters(decodedFilters);
      setAppliedFilters(decodedFilters);
      setCurrentPage(1);

      const searchFromSaved = urlParams.get("search");
      setTopSearchTerm(searchFromSaved || "");

      let cleanQueryString = matched.query_string;
      if (cleanQueryString.startsWith('?')) {
        cleanQueryString = cleanQueryString.substring(1);
      }

      const urlParamsForNav = new URLSearchParams(cleanQueryString);
      if (!urlParamsForNav.has('ordering')) {
        urlParamsForNav.set('ordering', 'closing_date');
      }
      urlParamsForNav.set('page', '1');
      urlParamsForNav.set('pageSize', '25');
      urlParamsForNav.set('id', matched.id);

      const fullURL = `/dashboard?${urlParamsForNav.toString()}`;
      navigate(fullURL, { replace: true });
    } catch (err) {
      console.error("Failed to load saved search filters", err);
    }
  }, [restrictions?.savedSearch, savedSearches, selectedSavedSearch, navigate, setFilters, setAppliedFilters, setCurrentPage, setTopSearchTerm, setSaveSearchFilters, setSelectedSavedSearch, showFeatureRestriction]);



  // 🔥 ENHANCED FILTER APPLY HANDLER (with search term clearing)
  const enhancedHandleFiltersApply = (newFilters) => {

    const filtersWithOrdering = {
      ...newFilters,
      ordering: newFilters.ordering || appliedFilters.ordering || "closing_date"
    };
    setCurrentPage(1);
    // setTopSearchTerm(""); // Clear search term when filters are applied
    handleFiltersApply(filtersWithOrdering);
  };

  // 🔥 REMAINING HANDLERS
  const handleSaveOrUpdate = (data) => {
    console.log("Save or Update called with data:", data);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // 🔥 UPDATE URL WITH NEW PAGE NUMBER
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page.toString());

    // 🔥 BUILD NEW URL WITH UPDATED PAGE
    const newURL = `/dashboard?${searchParams.toString()}`;

    // 🔥 UPDATE BROWSER URL WITHOUT FULL PAGE RELOAD
    navigate(newURL, { replace: false }); // replace: false allows proper back navigation

    // 🔥 SCROLL TO TABLE SECTION
    setTimeout(() => {
      if (bidsSectionRef.current) {
        bidsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };


  // console.log("🔥 Passing bids to BidTable:::::::::::::::::::::::::::::", bids);
  console.log("🔥 Current URL::::::::::::::::::::::::::::::::", window.location.search);

  console.log("🔥 Passing bids to BidTable:", isBookmarkView ? bookmarkedBids : (bidsInfo?.results || []));
  console.log("🔥 bidsInfo state:", bidsInfo);

  return (
    <>
      <div className="py-[120px] bg-blue">
        <FeatureRestrictionPopup
          isOpen={restrictionPopup.isOpen}
          onClose={closeFeatureRestriction}
          onUpgrade={handleUpgrade}
          title={restrictionPopup.title}
          message={restrictionPopup.message}
          featureName={restrictionPopup.featureName}
          showUpgradeButton={restrictionPopup.showUpgradeButton}
        />

        {sidebarToggle && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onClose={() => setSidebarToggle(false)}
            activeTab={activeFilterTab}
            setActiveTab={setActiveFilterTab}
            onApply={enhancedHandleFiltersApply}
          />
        )}

        {saveSearchToggle && (
          <FilterPanelSaveSearch
            handleSavedSearchSelect={enhancedHandleSavedSearchSelect} // ✅ PASS THE HANDLER
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
          <div className="dashboard-header flex justify-between items-center pt-5">
            <HeroHeading data={data} />
            <div className="flex items-center gap-[15px]">
              {/* <span className="font-inter text-[#DBDBDB]">Alert</span> */}
              {/* <AlertToggle /> */}
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

          <div className="dashboard-feature pt-20">
            <div className="flex justify-between items-center">
              <div className="feature-left">
                <div
                  className={`bg-btn p-4 w-[56px] h-[56px] rounded-[16px] flex justify-center items-center cursor-pointer ${restrictions?.advanceSearch ? 'opacity-50 bg-white/10' : ''
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFilter(); // Use enhanced function
                  }}
                  id="filter"
                  title={
                    restrictions?.advanceSearch
                      ? "Upgrade to use advanced filters"
                      : "Filter bids"
                  }
                >
                  {restrictions?.advanceSearch ? (
                    <i className="fas fa-lock text-sm text-white/60 w-6 h-6 flex items-center justify-center"></i>
                  ) : (
                    <img
                      src={sidebarToggle ? "/close.png" : "/filter.png"}
                      className="w-6"
                      alt="Filter Toggle"
                    />
                  )}
                </div>
              </div>


              <div className="dashboard-middle">
                {loading ? (
                  <StatShimmer />
                ) : (
                  <DashboardStats
                    bidCount={bidCount}
                    bidsInfo={bidsInfo}
                    bookmarkedCount={bookmarkedCount}
                    followedCount={followedCount}
                    restrictions={restrictions}
                    planInfo={profile} // Pass the full profile which contains subscription_plan
                    onNavigate={navigate}
                    onFollowedCardClick={handleFollowedCardClick}
                    onFeatureRestriction={showFeatureRestriction}
                  />
                )}
              </div>


              <div className="feature-right">
                <div className="flex gap-4 items-center">
                  {/* Export Button (already has restrictions) */}
                  <div
                    className={`bg-btn p-4 rounded-[16px] cursor-pointer relative ${exportLoading ? 'opacity-50' : restrictions?.export ? 'opacity-50 bg-white/10' : ''
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (restrictions?.export) {
                        showFeatureRestriction(
                          " Export Feature Locked",
                          "Upgrade your plan to export bid data in CSV format for analysis and reporting.",
                          "Export Feature",
                          true
                        );
                      } else if (!exportLoading) {
                        handleExport();
                      }
                    }}
                    title={
                      restrictions?.export
                        ? "Upgrade to export bids"
                        : exportLoading
                          ? "Exporting..."
                          : "Export bids to CSV"
                    }
                  >
                    {restrictions?.export ? (
                      <i className="fas fa-lock text-sm text-white/60 w-6 h-6 flex items-center justify-center"></i>
                    ) : exportLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <img src="/export.png" className="w-6" alt="Export" />
                    )}
                  </div>

                  {/* Saved Search Dropdown with restrictions */}
                  <div
                  // className={`${restrictions?.savedSearch ? 'opacity-50' : ''}`}
                  // onClick={(e) => {
                  //   if (restrictions?.savedSearch) {
                  //     e.preventDefault();
                  //     e.stopPropagation();
                  //     showFeatureRestriction(
                  //       " Saved Search Locked",
                  //       "Upgrade your plan to access and manage your saved searches for quick filtering.",
                  //       "Saved Search Feature",
                  //       true
                  //     );
                  //   }
                  // }}
                  // title={restrictions?.savedSearch ? "Upgrade to use saved searches" : undefined}
                  >
                    <ProfessionalSavedSearchDropdown
                      savedSearches={restrictions?.savedSearch ? [] : savedSearches}
                      selectedSavedSearch={restrictions?.savedSearch ? null : selectedSavedSearch}
                      handleSavedSearchSelect={restrictions?.savedSearch ? () => { } : enhancedHandleSavedSearchSelect}
                      disabled={restrictions?.savedSearch}
                    />
                  </div>

                  {/* Save Search Button with restrictions */}
                  <BgCover title="SAVE SEARCH" description="Keep these filters handy, come back to any set with one click.">
                    <div
                      className={`text-white cursor-pointer flex items-center ${restrictions?.savedSearch ? 'opacity-50' : ''
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveSearchClick(); // Use the new function with restrictions
                      }}
                      title={
                        restrictions?.savedSearch
                          ? "Upgrade to save searches"
                          : "Save current search"
                      }
                    >
                      {restrictions?.savedSearch && (
                        <i className="fas fa-lock text-sm text-white/60 mr-2"></i>
                      )}
                      Save Search
                    </div>
                  </BgCover>
                </div>
              </div>
            </div>
          </div>



          <div className="w-full" ref={bidsSectionRef}>
            {(loading || (isBookmarkView && bookmarkLoading)) ? (
              <div className="text-white text-center py-10">
                <BidTableShimmer />
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-10">{error}</div>
            ) : isRestrictedFollowView ? (
              // 🔥 NEW: Show restriction popup for follow route
              <div className="text-center py-20">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-12 max-w-md mx-auto">
                  <div className="mb-6">
                    <i className="fas fa-lock text-4xl text-white/40 mb-4"></i>
                    <h3 className="text-xl font-semibold text-white mb-2">Follow Feature Locked</h3>
                    <p className="text-white/70">Upgrade your plan to follow important bids and get instant notifications.</p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={handleUpgrade}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Upgrade Plan
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <BidTable
                bids={
                  isFollowView
                    ? followedBidsData
                    : isBookmarkView
                      ? bookmarkedBids
                      : (bidsInfo?.results || [])
                }
                onEntityTypeChange={handleEntityTypeChange}
                currentEntityType={appliedFilters.entityType || ""}
                totalCount={isBookmarkView ? bookmarkedBids.length : (bidsInfo?.count || 0)}
                currentSortField={appliedFilters.ordering || "closing_date"}
                currentSortOrder={appliedFilters.ordering?.startsWith('-') ? 'desc' : 'asc'}
                onSort={restrictions?.bidSummary ? () => { } : handleSort}
                sortingDisabled={restrictions?.bidSummary}
                ref={tableRef}
                viewType={
                  isFollowView
                    ? 'followed'
                    : isBookmarkView
                      ? 'saved'
                      : 'total'
                }
                onFeatureRestriction={showFeatureRestriction}
                onFollowBid={handleFollowBid}
                onUnfollowBid={handleUnfollowBid}
                followedBids={followedBids}
                followLoading={followLoading}
                planInfo={planInfo}
                blurConfig={blurConfig}
                shouldBlurBid={shouldBlurBid}
                restrictions={restrictions}
              />
            )}

            <Pagination
              totalResults={
                isFollowView
                  ? followedBidsData.length  // 🔥 FIX: Use real-time count for followed view
                  : isBookmarkView
                    ? bookmarkedBids.length
                    : (bidsInfo?.count || 0)
              }
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