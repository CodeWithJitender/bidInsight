import React, { useEffect, useState, useRef, useCallback, use } from "react";
import AlertToggle from "../components/AlertToggle";
import HeroHeading from "../components/HeroHeading";
import BgCover from "../components/BgCover";
import BidTable from "../components/BidTable";
import api from "../utils/axios";
import Pagination from "../components/Pagination";
import FilterPanel from "../components/FilterPanel";
import FilterPanelSaveSearch from "../components/FilterPanelSaveSearch";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { buildQueryString } from "../utils/buildQueryString";



function Dashboard() {
  const data = { title: "Dashboard" };
  const navigate = useNavigate();
  const tableRef = useRef();
  const perPage = 25;
  const bidsSectionRef = useRef(null);

  const [filters, setFilters] = useState({
    status: "Open Solicitations",
    categories: [],
    keyword: "",
    location: "",
    publishedDate: { from: "", to: "" },
    closingDate: { from: "", to: "" },
    solicitationType: [],
    naics_codes: [],
    unspsc_codes: [],
    includeKeywords: [],
    excludeKeywords: [],
  });

  const [saveSearchFilters, setSaveSearchFilters] = useState({
    searchName: "",
    status: "",
    categories: [],
    keyword: "",
    location: "",
    publishedDate: { from: "", to: "" },
    closingDate: { from: "", to: "" },
    solicitationType: [],
    naics_codes: [],
    unspsc_codes: [],
    includeKeywords: [],
    excludeKeywords: [],
  });

  const [appliedFilters, setAppliedFilters] = useState({
    status: "Open Solicitations",
  });

  // for toggle of filter and save search
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [saveSearchToggle, setSaveSearchToggle] = useState(false);

  // for dashboard
  const [currentPage, setCurrentPage] = useState(1);
  const [bids, setBids] = useState([]);        //for bid table 
  const [count, setCount] = useState(0);       // for count bids at top of dashboard
  const [totalResults, setTotalResults] = useState(0);   // for pagination use of total bids
  const [activeFilterTab, setActiveFilterTab] = useState(() => localStorage.getItem("lastActiveFilterTab") || "Status");

  // list of save searches comes from API here
  const [savedSearches, setSavedSearches] = useState([]);
  const [selectedSavedSearch, setSelectedSavedSearch] = useState("_default_");
  const [searchOption, setSearchOption] = useState("create");


  const [filtersRestored, setFiltersRestored] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  // extra data for dashboard like csv and middle data, page change.........
  const middle = [
    // { id: 1, title: "Total Bids", num: totalResults },
    { id: 2, title: "Active Bids", num: count },
    { id: 3, title: "New Bids", num: count },
    { id: 4, title: "Saved", num: "0" },
    { id: 5, title: "Followed", num: "0/25" },
  ];

  const handleExport = () => {
    if (tableRef.current) {
      tableRef.current.exportToCSV(); // call child method
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (bidsSectionRef.current) {
      bidsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  const handleOpenFilter = () => {
    const lastTab = localStorage.getItem("lastActiveFilterTab") || "Status";
    setActiveFilterTab(lastTab);
    setSidebarToggle(true);
  };




  useEffect(() => {
    const restoreFilters = () => {
      const storedFilters = localStorage.getItem("dashboardFilters");
      const storedAppliedFilters = localStorage.getItem("dashboardAppliedFilters");

      if (storedFilters) {
        try {
          const parsedFilters = JSON.parse(storedFilters);
          setFilters(parsedFilters);

          const urlParams = new URLSearchParams();

          // ✅ Add filters one-by-one to URL if they exist
          if (parsedFilters.status) urlParams.set("status", parsedFilters.status);
          if (parsedFilters.keyword) urlParams.set("keyword", parsedFilters.keyword);
          if (parsedFilters.location) urlParams.set("location", parsedFilters.location);

          // ✅ Published Date
          if (parsedFilters.publishedDate?.from)
            urlParams.set("published_from", parsedFilters.publishedDate.from);
          if (parsedFilters.publishedDate?.to)
            urlParams.set("published_to", parsedFilters.publishedDate.to);

          // ✅ Closing Date
          if (parsedFilters.closingDate?.from)
            urlParams.set("closing_from", parsedFilters.closingDate.from);
          if (parsedFilters.closingDate?.to)
            urlParams.set("closing_to", parsedFilters.closingDate.to);

          // ✅ Multi-select Arrays
          if (parsedFilters.solicitationType?.length)
            urlParams.set("solicitationType", parsedFilters.solicitationType.join(","));

          if (parsedFilters.naics_codes?.length)
            urlParams.set("naics_codes", parsedFilters.naics_codes.join(","));

          if (parsedFilters.unspsc_codes?.length)
            urlParams.set("unspsc_codes", parsedFilters.unspsc_codes.join(","));

          if (parsedFilters.includeKeywords?.length)
            urlParams.set("include", parsedFilters.includeKeywords.join(","));

          if (parsedFilters.excludeKeywords?.length)
            urlParams.set("exclude", parsedFilters.excludeKeywords.join(","));

          // ✅ Add default pagination
          urlParams.set("page", "1");
          urlParams.set("pageSize", "25");

          // ✅ Set in browser URL (without reload)
          setSearchParams(urlParams);

        } catch (e) {
          console.error("❌ Failed to parse storedFilters", e);
        }
      }

      if (storedAppliedFilters) {
        try {
          setAppliedFilters(JSON.parse(storedAppliedFilters));
        } catch (e) {
          console.error("❌ Failed to parse storedAppliedFilters", e);
        }
      }

      setFiltersRestored(true);
    };

    restoreFilters();
    // ✅ Re-apply filters when window regains focus
    window.addEventListener("focus", restoreFilters);
    return () => window.removeEventListener("focus", restoreFilters);
  }, []);


  
  // for filter functionality
  const fetchBids = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("User not logged in");
      setBids([]);
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("pageSize", perPage);

      const statusMap = {
        "Open Solicitations": "Active",
        "Closed Solicitations": "Inactive",
        "Awarded Solicitations": "Awarded",
      };

      const mappedStatus = statusMap[appliedFilters.status];
      if (mappedStatus) params.append("bid_type", mappedStatus);


      if (appliedFilters.naics_codes?.length > 0) {
        const codes = appliedFilters.naics_codes.map((item) =>
          typeof item === "string" ? item : item.code
        );
        params.append("naics_codes", codes.join(","));
      }


      if (appliedFilters.unspsc_codes?.length > 0) {
        const codes = appliedFilters.unspsc_codes.map((item) =>
          typeof item === "string" ? item : item.code
        );
        params.append("unspsc_codes", codes.join(","));
      }

      if (appliedFilters.includeKeywords?.length > 0) {
        params.append("include", appliedFilters.includeKeywords.join(","));
      }

      if (appliedFilters.excludeKeywords?.length > 0) {
        params.append("exclude", appliedFilters.excludeKeywords.join(","));
      }

      if (appliedFilters.location) {
        const stateParam = appliedFilters.location
          .split(",")
          .map((name) => name.trim())
          .join(",");
        params.append("state", stateParam);
      }

      if (appliedFilters.publishedDate?.from && appliedFilters.publishedDate?.to) {
        const fromDate = new Date(appliedFilters.publishedDate.from);
        const toDate = new Date(appliedFilters.publishedDate.to);
        if (fromDate <= toDate) {
          params.append("open_date_after", appliedFilters.publishedDate.from);
          params.append("open_date_before", appliedFilters.publishedDate.to);
        }
      }

      if (appliedFilters.closingDate?.from && appliedFilters.closingDate?.to) {
        const fromDate = new Date(appliedFilters.closingDate.from);
        const toDate = new Date(appliedFilters.closingDate.to);
        if (fromDate <= toDate) {
          params.append("close_date_after", appliedFilters.closingDate.from);
          params.append("close_date_before", appliedFilters.closingDate.to);
        }
      }

      if (appliedFilters.solicitationType?.length > 0) {
        params.append("solicitation", appliedFilters.solicitationType.join(","));
      }

      if (searchText.trim()) {
        params.append("include", searchText.trim());
      }

      console.log("Final query params:", params.toString());
      setSearchParams(params)

      const res = await api.get(`/bids/?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setCount(res.data.count);
      const bidList = res.data.results || res.data;
      setBids(bidList);
      setTotalResults(res.data.count || bidList.length);
    } catch (err) {
      if (err.response?.data?.code === "token_not_valid") {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to fetch bids");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, appliedFilters, searchText, navigate]);


  useEffect(() => {
    if (!filtersRestored) return;

    const delayDebounce = setTimeout(() => {
      fetchBids();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [appliedFilters, currentPage, searchText, filtersRestored]);




  // listing the saved searches in dropdown of dashboard
  const fetchSavedSearches = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await api.get("/bids/saved-filters/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // const saved = res.data.map((item) => item.name);
      // console.log(saved[0])
      setSavedSearches(res.data); // ✅ Save full list of objects
      return res.data
    } catch (err) {
      console.error("Failed to fetch saved searches", err);
      return []
    }
  };
  const onApply = () => {
    fetchBidsWithParams(filters); // or your own logic
  };


  const handleSavedSearchSelect = async (searchId) => {
    const token = localStorage.getItem("access_token");

    try {
      const res = await api.get("/bids/saved-filters/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const matched = res.data.find((item) => item.id === searchId);
      if (!matched) return;

      const urlParams = new URLSearchParams(matched.query_string);
      const filtersToUse = Object.fromEntries(urlParams.entries());

      const finalFilters = {
        status: filtersToUse?.bid_type || "Open Solicitations",
        keyword: filtersToUse?.bid_name || "",
        location: filtersToUse?.state || "",
        publishedDate: {
          from: filtersToUse?.open_date_after || "",
          to: filtersToUse?.open_date_before || "",
        },
        closingDate: {
          from: filtersToUse?.close_date_after || "",
          to: filtersToUse?.close_date_before || "",
        },
        solicitationType: filtersToUse?.solicitation?.split(",") || [],
        naics_codes: filtersToUse?.naics_codes?.split(",") || [],
        unspsc_codes: filtersToUse?.unspsc_codes?.split(",") || [],
        includeKeywords: filtersToUse?.include?.split(",") || [],
        excludeKeywords: filtersToUse?.exclude?.split(",") || [],
      };

      setSelectedSavedSearch({ id: matched.id, name: matched.name });

      // ✅ Wait for state update before calling onApply
      applyFiltersGlobally(finalFilters); // internally this should call setFilters

      // 👇 delay needed to wait for state update
    

    } catch (err) {
      console.error("❌ Failed to fetch saved search filters", err);
    }
  };




  // Utility to apply filters
  const applyFiltersGlobally = (filters) => {
    setSaveSearchFilters(filters);
    setFilters(filters);
    setAppliedFilters(filters);
    setSearchOption("replace");
    // fetchBidsWithParams(filters);
  };


const postSaveSearch = async (data) => {
  console.log("🟩 postSaveSearch → name:", data.name);
  console.log("🟩 postSaveSearch → filters:", data.filters);

  const token = localStorage.getItem("access_token");
  const filtersToUse = data.filters;
  const params = new URLSearchParams();

  const statusMap = {
    "Open Solicitations": "Active",
    "Closed Solicitations": "Inactive",
    "Awarded Solicitations": "Awarded",
  };

  const effectiveStatus = filtersToUse.status || "Open Solicitations";
  const mappedStatus = statusMap[effectiveStatus];
  if (mappedStatus) params.append("bid_type", mappedStatus);

  if (filtersToUse.keyword) params.append("bid_name", filtersToUse.keyword);
  if (filtersToUse.location) {
    const stateParam = filtersToUse.location.split(",").map((name) => name.trim()).join(",");
    params.append("state", stateParam);
  }

  if (filtersToUse.publishedDate?.from && filtersToUse.publishedDate?.to) {
    const fromDate = new Date(filtersToUse.publishedDate.from);
    const toDate = new Date(filtersToUse.publishedDate.to);
    if (fromDate <= toDate) {
      params.append("open_date_after", filtersToUse.publishedDate.from);
      params.append("open_date_before", filtersToUse.publishedDate.to);
    }
  }

  if (filtersToUse.closingDate?.from && filtersToUse.closingDate?.to) {
    const fromDate = new Date(filtersToUse.closingDate.from);
    const toDate = new Date(filtersToUse.closingDate.to);
    if (fromDate <= toDate) {
      params.append("close_date_after", filtersToUse.closingDate.from);
      params.append("close_date_before", filtersToUse.closingDate.to);
    }
  }

  if (filtersToUse.solicitationType?.length > 0) {
    params.append("solicitation", filtersToUse.solicitationType.join(","));
  }

  if (filtersToUse.naics_codes?.length > 0) {
    const codes = filtersToUse.naics_codes.map((item) =>
      typeof item === "string" ? item : item.code
    );
    params.append("naics_codes", codes.join(","));
  }

  if (filtersToUse.unspsc_codes?.length > 0) {
    const codes = filtersToUse.unspsc_codes.map((item) =>
      typeof item === "string" ? item : item.code
    );
    params.append("unspsc_codes", codes.join(","));
  }

  if (filtersToUse.includeKeywords?.length > 0) {
    params.append("include", filtersToUse.includeKeywords.join(","));
  }

  if (filtersToUse.excludeKeywords?.length > 0) {
    params.append("exclude", filtersToUse.excludeKeywords.join(","));
  }

  const queryString = `?${params.toString()}`;

  try {
    const body = {
      name: data.name,
      query_string: queryString,
      is_default: data.isDefault,
    };

    // ✅ IF REPLACE
    if (searchOption === "replace" && selectedSavedSearch?.id) {
      await api.put(`/bids/saved-filters/${selectedSavedSearch.id}/`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // ✅ ELSE: create new
      await api.post("/bids/saved-filters/", body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    const { searchName, ...filtersWithoutSearchName } = filtersToUse;

    await fetchSavedSearches(); // ✅ Refresh dropdown list
    console.log("🟩 postSaveSearch → fetched saved searches after save");

    // ✅ Get the newly saved search by name
    const latestListRes = await api.get("/bids/saved-filters/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const newSaved = latestListRes.data.find((item) => item.name === data.name);

    if (newSaved) {
      setSelectedSavedSearch({ id: newSaved.id, name: newSaved.name }); // ✅ set dropdown value
      await handleSavedSearchSelect(newSaved.id); // ✅ apply it
    }

    if (searchOption === "apply") {
      setFilters(filtersWithoutSearchName);
    }

    // Reset modal
    setSaveSearchFilters({
      searchName: "",
      status: "",
      categories: [],
      keyword: "",
      location: "",
      publishedDate: { from: "", to: "" },
      closingDate: { from: "", to: "" },
      solicitationType: [],
      naics_codes: [],
      unspsc_codes: [],
      includeKeywords: [],
      excludeKeywords: [],
    });

    setSearchOption("replace");
    setSaveSearchToggle(false); // close modal
  } catch (err) {
    console.error("❌ Failed to save/update search", err);
  }
};



  const handleSaveOrUpdate = async (data) => {
    console.log("🟨 handleSaveOrUpdate → data:", data);
    console.log("🟨 handleSaveOrUpdate → saveSearchFilters:", saveSearchFilters);

    const filtersToUse = saveSearchFilters;

    console.log("✅ Filters at save time →", filtersToUse); // 👈 Yeh line add karo yahan

    if (data.action === "replace") {
      const matchedSearch = savedSearches.find((s) => s.name === data.name);

      if (matchedSearch) {
        const id = matchedSearch.id || matchedSearch._id;
        const queryString = buildQueryString(filtersToUse);

        await updateSavedSearch({
          filters: filtersToUse,
          isDefault: data.isDefault,
        });


        // toast.success("Saved search replaced");
        setSaveSearchToggle(false);
        fetchBidsWithParams(filtersToUse);
      } else {
        toast.error("Matching search not found");
      }
    } else {
      postSaveSearch({
        filters: filtersToUse,
        name: data.name,
        isDefault: data.isDefault,
      });
    }
  };

  const updateSavedSearch = async (data) => {
    // console.log("🟧 updateSavedSearch → filtersToUse:", filtersToUse);
    console.log("🟧 updateSavedSearch → selectedSavedSearch:", selectedSavedSearch);

    const token = localStorage.getItem("access_token");
    if (!token || !selectedSavedSearch?.id) return console.error("🔒 Missing token or selected search ID");

    const filtersToUse = data.filters || {};
    const params = new URLSearchParams();


    const statusMap = {
      "Open Solicitations": "Active",
      "Closed Solicitations": "Inactive",
      "Awarded Solicitations": "Awarded",
    };

    const effectiveStatus = filtersToUse.status || "Open Solicitations";
    const mappedStatus = statusMap[effectiveStatus];
    if (mappedStatus) params.append("bid_type", mappedStatus);

    if (filtersToUse.keyword) params.append("bid_name", filtersToUse.keyword);

    if (filtersToUse.location) {
      const stateParam = filtersToUse.location
        .split(",")
        .map((name) => name.trim())
        .join(",");
      params.append("state", stateParam);
    }

    const appendDateRange = (filterKey, afterKey, beforeKey) => {
      const range = filtersToUse[filterKey];
      if (range?.from && range?.to) {
        const fromDate = new Date(range.from);
        const toDate = new Date(range.to);
        if (fromDate <= toDate) {
          params.append(afterKey, range.from);
          params.append(beforeKey, range.to);
        }
      }
    };

    appendDateRange("publishedDate", "open_date_after", "open_date_before");
    appendDateRange("closingDate", "close_date_after", "close_date_before");

    if (Array.isArray(filtersToUse.solicitationType) && filtersToUse.solicitationType.length > 0) {
      params.append("solicitation", filtersToUse.solicitationType.join(","));
    }

    const appendCodeList = (list, key) => {
      if (Array.isArray(list) && list.length > 0) {
        const codes = list.map((item) => (typeof item === "string" ? item : item.code));
        params.append(key, codes.join(","));
      }
    };

    appendCodeList(filtersToUse.naics_codes, "naics_codes");
    appendCodeList(filtersToUse.unspsc_codes, "unspsc_codes");
    appendCodeList(filtersToUse.includeKeywords, "include");
    appendCodeList(filtersToUse.excludeKeywords, "exclude");

    const queryString = `?${params.toString()}`;

    try {
      const body = {
        name: selectedSavedSearch?.name || "Unnamed",
        query_string: queryString,
        is_default: data.isDefault,
      };

      console.log("🟧 updateSavedSearch → query string:", queryString);

      const response = await api.put(
        `/bids/saved-filters/${selectedSavedSearch.id}/`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedSavedSearch = response.data;

      setFilters(filtersToUse);
      setAppliedFilters(filtersToUse);
      await fetchSavedSearches();
      setSelectedSavedSearch(updatedSavedSearch);

      setSaveSearchToggle(false);
      fetchBidsWithParams(filtersToUse);
    } catch (err) {
      console.error("❌ Failed to update saved search:", err?.response || err.message || err);
    }
  };

  const fetchBidsWithParams = async (customFilters) => {
    console.log("🟥 fetchBidsWithParams → filters received:", customFilters);

    setLoading(true);
    setError("");
    const token = localStorage.getItem("access_token");

    try {
      const params = new URLSearchParams();
      params.append("page", 1);
      params.append("pageSize", perPage);

      const statusMap = {
        "Open Solicitations": "Active",
        "Closed Solicitations": "Inactive",
        "Awarded Solicitations": "Awarded",
      };

      const mappedStatus = statusMap[customFilters.status];
      if (mappedStatus) params.append("bid_type", mappedStatus);

      if (customFilters.keyword) params.append("bid_name", customFilters.keyword);
      if (customFilters.location) {
        const stateParam = customFilters.location.split(",").map((s) => s.trim()).join(",");
        params.append("state", stateParam);
      }

      if (customFilters.publishedDate?.from && customFilters.publishedDate?.to) {
        params.append("open_date_after", customFilters.publishedDate.from);
        params.append("open_date_before", customFilters.publishedDate.to);
      }

      if (customFilters.closingDate?.from && customFilters.closingDate?.to) {
        params.append("close_date_after", customFilters.closingDate.from);
        params.append("close_date_before", customFilters.closingDate.to);
      }

      if (customFilters.solicitationType?.length > 0) {
        params.append("solicitation", customFilters.solicitationType.join(","));
      }

      if (customFilters.naics_codes?.length > 0) {
        const codes = customFilters.naics_codes.map((item) =>
          typeof item === "string" ? item : item.code
        );
        params.append("naics_codes", codes.join(","));
      }

      if (customFilters.unspsc_codes?.length > 0) {
        const codes = customFilters.unspsc_codes.map((item) =>
          typeof item === "string" ? item : item.code
        );
        params.append("unspsc_codes", codes.join(","));
      }

      if (customFilters.includeKeywords?.length > 0) {
        params.append("include", customFilters.includeKeywords.join(","));
      }

      if (customFilters.excludeKeywords?.length > 0) {
        params.append("exclude", customFilters.excludeKeywords.join(","));
      }

      const res = await api.get(`/bids/?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}`} : {},
      });

      setCount(res.data.count);
      const bidList = res.data.results || res.data;
      setBids(bidList);
      setTotalResults(res.data.count || bidList.length);
    } catch (err) {
      console.error("❌ fetchBidsWithParams error:", err);
      setError("Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSavedSearches();
  }, []);

  // useEffect(() => {
  //   console.log("Updated filters: ", filters);
  // }, [filters]);


  return (
    <>
      <div className="py-[120px] bg-blue">
        {sidebarToggle && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onClose={() => {
              setAppliedFilters(filters);
              setSidebarToggle(false);
              setCurrentPage(1);
            }}
            activeTab={activeFilterTab}
            setActiveTab={(tab) => {
              setActiveFilterTab(tab);
              localStorage.setItem("lastActiveFilterTab", tab);
            }}
            onApply={() => {
              setAppliedFilters(filters);
              setSidebarToggle(false);
              setCurrentPage(1);
            }}
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
            onApply={() => {
              // 🔁 Trigger the tab update / fetch again
              fetchBidsWithParams(saveSearchFilters);
            }}
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
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
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
                      onChange={(e) => handleSavedSearchSelect(Number(e.target.value))} // ✅ Convert to number
                    >
                      <option value="_default_">My Saved Searches</option> {/* Optional default */}
                      {savedSearches.map((search, index) => (
                        <option key={search.id || index} className="text-black" value={search.id}>
                          {search.name}
                        </option>
                      ))}
                    </select>


 {/* className="bg-transparent text-white focus:outline-none focus:ring-0" */}
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
              <BidTable bids={bids} ref={tableRef} />
            )}

            <Pagination
              totalResults={totalResults}
              perPage={perPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;