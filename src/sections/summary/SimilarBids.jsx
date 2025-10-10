import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faRedo } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function SimilarBids({ similarBids }) {
  console.log(similarBids, "🔥 Bid Data in SimilarBids");

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // full month name like "July"
      day: "numeric", // day number
    });
  };

  return (
    <div className="summary">
      <div className="space-y-6 text-white container-fixed">
        <h1 className="font-archivo font-semibold text-xl md:text-p xl:text-[30px]">
          Explore More Bids
        </h1>

        {similarBids.length > 0 ? (
          <div className="divide-y divide-white/20 flex flex-col ">
            {similarBids.map((bid, index) => (
              console.log(bid, "🔥 Individual Bid in SimilarBids"),
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
              >
                {/* Left Section */}
                <div className="space-y-1 ">
                  <p className="font-archivo text-p font-bold">
                    {bid.bid_name || "Untitled Bid"}
                  </p>
                </div>

                {/* Middle Section */}
                <div className="text-sm space-y-1 sm:text-right">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>
                      <span className="text-[#DBDBDB] ml-1">Posted: </span>
                      {formatDate(bid.open_date) || formatDate(bid.postedDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faRedo} />
                    <span>
                      <span className="text-[#DBDBDB] ml-1">Deadline: </span>
                      {formatDate(bid.closing_date) || formatDate(bid.deadline)}
                    </span>
                  </div>
                </div>

                {/* Right Section */}
                <div>
                  <Link
                    to={bid.link || `/summary/${bid.id}`}
                    className="text-white hover:text-[#DBDBDB] transition underline font-inter"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#DBDBDB] italic">No similar bids found.</p>
        )}

        <div className="text-right pt-2">
          <Link
            to="/dashboard"
            className="text-white hover:text-[#DBDBDB] font-medium transition underline"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SimilarBids;
