import React, { useState, useRef, useEffect, useCallback } from "react";

import AlertToggle from "../components/AlertToggle";
import HeroHeading from "../components/HeroHeading";
import BgCover from "../components/BgCover";
import BidTable from "../components/BidTable";
import Pagination from "../components/Pagination";
import FilterPanel from "../components/FilterPanel";
import FilterPanelSaveSearch from "../components/FilterPanelSaveSearch";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const data = { title: "Dashboard" };
  const navigate = useNavigate();
  const tableRef = useRef();
  const bidsSectionRef = useRef(null);
  const perPage = 25;

  // API data and loading states
  const [bids, setBids] = useState([]);
  const [count, setCount] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state for toggling panels
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [saveSearchToggle, setSaveSearchToggle] = useState(false);

  // Pagination and page state
  const [currentPage, setCurrentPage] = useState(1);

  // Active filter tab for FilterPanel controlled internally
  const [activeFilterTab, setActiveFilterTab] = useState("Status");

  // Minimal filters state (optional, can be omitted if FilterPanel manages internally)
  const [filters, setFilters] = useState({});

  // Fetch bids – kept minimal without filter params or saved search
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
      // Minimal request without filters or query params
      const res = await api.get(`/bids/?page=${currentPage}&pageSize=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCount(res.data.count);
      const bidList = res.data.results || res.data;
      setBids(bidList);
      setTotalResults(res.data.count || bidList.length);
    } catch (err) {
      console.error("Failed to fetch bids:", err);
      setError("Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  }, [currentPage, navigate, perPage]);

  // Fetch bids initially and on page change
  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (bidsSectionRef.current) {
      bidsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenFilter = () => {
    // Open filter panel with default tab "Status"
    setActiveFilterTab("Status");
    setSidebarToggle(true);
  };

  const handleExport = () => {
    if (tableRef.current) {
      tableRef.current.exportToCSV();
    }
  };

  return (
    <>
      <div className="py-[120px] bg-blue">
        {sidebarToggle && (
          <FilterPanel/>
        )}

        {saveSearchToggle && (
          <FilterPanelSaveSearch/>
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
                  // Search text input is uncontrolled, or optionally manage state if desired
                />
              </div>
            </div>
          </div>

          <div className="dashboard-middle">
            <div className="max-w-[1200px] py-[80px] flex justify-center mx-auto gap-8">
              <BgCover>
                <div className="flex gap-4">
                  <div className="text font-inter text-[#DBDBDB]">Active Bids</div>
                  <p className="num font-inter font-bold text-white">{count}</p>
                </div>
              </BgCover>
              {/* Additional summary stats can be added here */}
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
                  <img src={sidebarToggle ? "close.png" : "filter.png"} className="w-6" alt="Filter Toggle" />
                </div>
              </div>

              <div className="feature-right">
                <div className="flex gap-4">
                  <div className="bg-btn p-4 rounded-[16px] cursor-pointer" onClick={handleExport} id="export">
                    <img src="export.png" className="w-6" alt="Export" />
                  </div>
                  <BgCover>
                    <div className="text-white cursor-pointer" onClick={() => setSaveSearchToggle(true)}>
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
