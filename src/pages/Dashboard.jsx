import React, { useEffect, useState, useRef } from "react";
import ProcessWrapper from "../components/ProcessWrapper";
import AlertToggle from "../components/AlertToggle";
import Heading from "../components/Heading";
import HeroHeading from "../components/HeroHeading";
import BgCover from "../components/BgCover";
import BidTable from "../components/BidTable";
import api from "../utils/axios";
import Pagination from "../components/Pagination";
import FilterPanel from "../components/FilterPanel";
import { useNavigate } from "react-router-dom";
import FilterPanelSaveSearch from "../components/FilterPanelSaveSearch";

function Dashboard() {
  const data = {
    title: "Dashboard",
    // container: "max-w-4xl mx-auto text-center",
  };

  // State for bids and pagination
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const perPage = 25;
  const bidsSectionRef = useRef(null);
  const [count, setCount] = useState(0);
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [saveSearchToggle, setSaveSearchToggle] = useState(false);
  const navigate = useNavigate();
  const middle = [
    { id: 1, title: "Total Bids", num: totalResults },
    { id: 2, title: "Active Bids", num: count },
    { id: 3, title: "New Bids", num: count },
    { id: 4, title: "Saved", num: "0" },
    { id: 5, title: "Followed", num: "0/25" },
  ];

  useEffect(() => {
    async function fetchBids() {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("User not logged in");
        setBids([]); // clear old data
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        // /bids/?bid_name=DC Motor Test Stand&page=${currentPage}&pageSize=25
        const res = await api.get(
          `https://apibid.collegedwarka.com/api/bids/?pageSize=25&page=${currentPage}&bid_type=Active`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        setCount(res.data.count);
        console.log(
          `https://apibid.collegedwarka.com/api/bids/?pageSize=${currentPage}5&page=1&bid_type=Active`
        );
        // If response is paginated, use res.data.results, else res.data
        const bidList = res.data.results || res.data;
        console.log(bidList);
        setBids(bidList);
        setTotalResults(res.data.count || bidList.length);
      } catch (err) {
        if (
          err.response &&
          err.response.data &&
          err.response.data.code === "token_not_valid"
        ) {
          setError("Session expired. Please login again.");
        } else {
          setError("Failed to fetch bids");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBids();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll only the bids section into view, not the whole dashboard
    if (bidsSectionRef.current) {
      bidsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="bg-blue h-screen overflow-scroll">
      {/* <FilterPanel/> */}
      {sidebarToggle && (
        <FilterPanel onClose={() => setSidebarToggle((prev) => !prev)} />
      )}
      {saveSearchToggle && (
        <FilterPanelSaveSearch
          onClose={() => setSaveSearchToggle((prev) => !prev)}
        />
      )}

      <div className="container-fixed py-10 px-4">
        <div className="dashboard-header  flex justify-between items-center">
          <div className="title">
            <HeroHeading data={data} />
          </div>
          <div className="flex items-center gap-[15px]">
            <span className="font-inter text-[#DBDBDB]">Alert</span>{" "}
            <AlertToggle />
            <div className="search-box bg-btn p-4 px-6 flex gap-3 items-center rounded-[30px]">
              <i class="far text-white fa-search"></i>
              <input
                type="text"
                placeholder="Search titles or organization or location"
                className="text-white bg-transparent w-[300px]  border-none outline-none"
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
                onClick={() => setSidebarToggle((prev) => !prev)} // ✅ wrapped in arrow function
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
                <div className="bg-btn p-4 rounded-[16px]" id="export">
                  <img src="export.png" className="w-6" alt="" />
                </div>
                <div className="saved-search bg-btn p-4 px-6 rounded-[30px] font-inter font-medium">
                  <select
                    name=""
                    id="saved-search"
                    className="bg-transparent text-white"
                  >
                    <option
                      className="text-black"
                      value="My Saved Searches"
                      selected
                    >
                      My Saved Searches
                    </option>
                    <option className="text-black" value="My Saved Searches">
                      My Saved Searches
                    </option>
                    <option className="text-black" value="My Saved Searches">
                      My Saved Searches
                    </option>
                    <option className="text-black" value="My Saved Searches">
                      My Saved Searches
                    </option>
                    <option className="text-black" value="My Saved Searches">
                      My Saved Searches
                    </option>
                  </select>
                </div>
                <BgCover>
                  <div
                    className="text-white"
                    onClick={() => setSaveSearchToggle((prev) => !prev)}
                  >
                    Save Search
                  </div>
                </BgCover>
              </div>
            </div>
          </div>
        </div>
        <div ref={bidsSectionRef}>
          {/* Pass bids to BidTable, show loading/error if needed */}
          {loading ? (
            <div className="text-white text-center py-10">Loading...</div>
          ) : error ? (
            <div className="text-red-400 text-center py-10">{error}</div>
          ) : (
            <BidTable bids={bids} />
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
  );
}

export default Dashboard;
