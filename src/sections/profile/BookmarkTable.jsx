import React, { useState, useRef } from "react";
import { FiBookmark } from "react-icons/fi";
import { bookmarkedBids } from "./bookmarkedBids"; // your data file
import CustomTooltip from "../../components/CustomTooltip";

export default function BookmarkTable({ type, data }) {
  const [bids, setBids] = useState(data);
  const [removedIds, setRemovedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const timers = useRef({});

  // Pagination logic
  const indexOfLastBid = currentPage * rowsPerPage;
  const indexOfFirstBid = indexOfLastBid - rowsPerPage;
  const currentBids = bids.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(bids.length / rowsPerPage);

  const handleBookmark = (id) => {
    if (removedIds.includes(id)) {
      // Undo
      setRemovedIds((prev) => prev.filter((bidId) => bidId !== id));
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    } else {
      // Mark for removal
      setRemovedIds((prev) => [...prev, id]);

      // Remove after 3s
      timers.current[id] = setTimeout(() => {
        setBids((prev) => {
          const updated = prev.filter((bid) => bid.id !== id);

          // FIX: adjust pagination if current page becomes empty
          const lastPage = Math.ceil(updated.length / rowsPerPage) || 1;
          if (currentPage > lastPage) {
            setCurrentPage(lastPage);
          }

          return updated;
        });

        setRemovedIds((prev) => prev.filter((bidId) => bidId !== id));
        delete timers.current[id];
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
     <div className="flex items-center gap-2 mb-3 w-full ">
          <p className="text-2xl font-medium  font-inter">{type === "bookmarked" ? "Bookmarked Bids" : "Followed Bids"}</p>
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
              <th className="font-inter font-medium text-base py-3 px-4">Bookmark</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentBids.map((bid) => {
              const isRemoved = removedIds.includes(bid.id);
              return (
                <tr
                  key={bid.id}
                  className={`border-b last:border-0 transition-opacity duration-500 ${
                    isRemoved ? "opacity-50" : "opacity-100 hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`py-3 px-4 ${isRemoved ? "text-gray-400" : ""}`}
                  >
                    {bid.entityType}
                  </td>
                  <td
                    className={`py-3 px-4 truncate max-w-[250px] ${
                      isRemoved ? "text-gray-400" : ""
                    }`}
                  >
                    {bid.bidName}
                  </td>
                  <td
                    className={`py-3 px-4 ${isRemoved ? "text-gray-400" : ""}`}
                  >
                    {bid.openDate}
                  </td>
                  <td
                    className={`py-3 px-4 ${isRemoved ? "text-gray-400" : ""}`}
                  >
                    {bid.closedDate}
                  </td>
                  <td
                    className={`py-3 px-4 ${isRemoved ? "text-gray-400" : ""}`}
                  >
                    {bid.countdown}
                  </td>
                  <td className="py-3 px-4 flex items-center justify-center gap-2 relative">
                    {type === "bookmarked" ? (
                      <i
                        className={`fa-bookmark cursor-pointer transition ${
                          isRemoved
                            ? "fal text-gray-400"
                            : "fas text-primary hover:scale-110"
                        }`}
                        onClick={() => handleBookmark(bid.id)}
                      ></i>
                    ) : (
                      <i
                        className={`fas cursor-pointer transition ${
                          isRemoved
                            ? "fa-minus-circle text-gray-400"
                            : "fa-plus-circle text-primary hover:scale-110"
                        }`}
                        onClick={() => handleBookmark(bid.id)}
                      ></i>
                    )}
                    {isRemoved && (
                      <button
                        className="text-sm text-gray-400 hover:text-blue-500 absolute top-[50%] left-[65%]  translate-y-[-50%]"
                        onClick={() => handleBookmark(bid.id)}
                      >
                        Undo
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-white bg-blue p-3 rounded-lg font-inter">
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

        <div>
          Result per page:{" "}
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-2 bg-primary text-white px-2 py-1 rounded"
          >
            {generatePageSizes(bids.length).map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
