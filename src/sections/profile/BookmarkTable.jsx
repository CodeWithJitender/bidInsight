import React, { useState, useRef } from "react";
import { FiBookmark } from "react-icons/fi";
import CustomTooltip from "../../components/CustomTooltip";
import { useNavigate } from "react-router-dom";
export default function BookmarkTable({ type, data, onRemove, loading }) {
  const [bids, setBids] = useState(data);
  const [removedIds, setRemovedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const timers = useRef({});

  // Update bids when data prop changes
  React.useEffect(() => {
    setBids(data);
  }, [data]);
 const navigate = useNavigate();
  // Pagination logic
  const indexOfLastBid = currentPage * rowsPerPage;
  const indexOfFirstBid = indexOfLastBid - rowsPerPage;
  const currentBids = bids.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(bids.length / rowsPerPage);

  // Handle row click to navigate to summary
  const handleRowClick = (bidId) => {
    console.log("Navigating to bid summary:", bidId);
    navigate(`/summary/${bidId}`);
  };

  // Handle remove with API call
  const handleRemove = async (bidId) => {
    if (removedIds.includes(bidId)) {
      // Undo - remove from pending removal
      setRemovedIds((prev) => prev.filter((id) => id !== bidId));
      clearTimeout(timers.current[bidId]);
      delete timers.current[bidId];
    } else {
      // Mark for removal (visual feedback)
      setRemovedIds((prev) => [...prev, bidId]);

      // Set timer for actual removal
      timers.current[bidId] = setTimeout(async () => {
        try {
          // Call parent's remove function with bidId
          const success = await onRemove(bidId);
          
          if (success) {
            // Remove from local state
            setBids((prev) => {
              const updated = prev.filter((bid) => bid.bidId !== bidId);

              // Adjust pagination if current page becomes empty
              const lastPage = Math.ceil(updated.length / rowsPerPage) || 1;
              if (currentPage > lastPage) {
                setCurrentPage(lastPage);
              }

              return updated;
            });
          }
        } catch (error) {
          console.error('Error removing bid:', error);
          // Remove from pending removal on error
          setRemovedIds((prev) => prev.filter((id) => id !== bidId));
        }

        // Clean up
        setRemovedIds((prev) => prev.filter((id) => id !== bidId));
        delete timers.current[bidId];
      }, 3000);
    }
  };

  // Generate dynamic page size options
  const generatePageSizes = (total) => {
    const steps = [10, 25, 50, 75, 100];
    const options = steps.filter((size) => size < total);
    options.push(total); // always include total as last option
    return options;
  };

  return (
    <div className="p-6 font-inter">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3 w-full">
        <p className="text-2xl font-medium font-inter">
          {type === "bookmarked" ? "Bookmarked Bids" : "Followed Bids"}
        </p>
        <CustomTooltip title={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. "} />
      </div>

      {/* Table */}
      <div className="border-2 border-primary rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-primary bg-gray-50 text-center">
              <th className="font-inter font-medium text-base py-3 px-4">Entity Type</th>
              <th className="font-inter font-medium text-base py-3 px-4">Bid Name</th>
              <th className="font-inter font-medium text-base py-3 px-4">Open Date</th>
              <th className="font-inter font-medium text-base py-3 px-4">Closed Date</th>
              <th className="font-inter font-medium text-base py-3 px-4">Countdown</th>
              <th className="font-inter font-medium text-base py-3 px-4">
                {type === "bookmarked" ? "Bookmark" : "Follow"}
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentBids.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  {loading ? "Loading..." : `No ${type} bids found`}
                </td>
              </tr>
            ) : (
              currentBids.map((bid) => {
                const isRemoved = removedIds.includes(bid.bidId);
                return (
                  <tr
                    key={bid.bidId}
                    className={`border-b last:border-0 transition-opacity duration-500 cursor-pointer ${
                      isRemoved ? "opacity-50" : "opacity-100 hover:bg-gray-50"
                    }`}
                    onClick={() => handleRowClick(bid.bidId)}
                  >
                    <td className={`py-3 px-4 ${isRemoved ? "text-gray-400" : ""}`}>
                      {bid.entityType}
                    </td>
                    <td className={`py-3 px-4 truncate max-w-[250px] ${isRemoved ? "text-gray-400" : ""}`}>
                      {bid.bidName}
                    </td>
                    <td className={`py-3 px-4 ${isRemoved ? "text-gray-400" : ""}`}>
                      {bid.openDate}
                    </td>
                    <td className={`py-3 px-4 ${isRemoved ? "text-gray-400" : ""}`}>
                      {bid.closedDate}
                    </td>
                    <td className={`py-3 px-4 ${isRemoved ? "text-gray-400" : ""}`}>
                      {bid.countdown}
                    </td>
                    <td className="py-3 px-4 flex items-center justify-center gap-2 relative" onClick={(e) => e.stopPropagation()}>
                      {type === "bookmarked" ? (
                        <i
                          className={`fa-bookmark cursor-pointer transition ${
                            isRemoved
                              ? "fal text-gray-400"
                              : "fas text-primary hover:scale-110"
                          }`}
                          onClick={() => handleRemove(bid.bidId)}
                        ></i>
                      ) : (
                        <i
                          className={`fas cursor-pointer transition ${
                            isRemoved
                              ? "fa-plus-circle text-gray-400"
                              : "fa-minus-circle text-primary hover:scale-110"
                          }`}
                          onClick={() => handleRemove(bid.bidId)}
                        ></i>
                      )}
                      {isRemoved && (
                        <button
                          className="text-sm text-gray-400 hover:text-blue-500 absolute top-[50%] left-[65%] translate-y-[-50%]"
                          onClick={() => handleRemove(bid.bidId)}
                        >
                          Undo
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {bids.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm text-black p-3 rounded-lg font-inter">
          <span>
            {indexOfFirstBid + 1}-{Math.min(indexOfLastBid, bids.length)} of{" "}
            {bids.length} results found
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="disabled:opacity-40"
            >
              «
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="disabled:opacity-40"
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 ${
                  currentPage === i + 1 ? "font-bold underline" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="disabled:opacity-40"
            >
              ›
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="disabled:opacity-40"
            >
              »
            </button>
          </div>

          {/* <div>
            Result per page:{" "}
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 text-black px-2 py-1 rounded"
            >
               {generatePageSizes(bids.length).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select> 
          </div> */}
        </div>
      )}
    </div>
  );
}