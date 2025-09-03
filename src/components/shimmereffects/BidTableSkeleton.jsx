import React from "react";
// import "./index.css"; // Assuming you have styles for shimmer effect

const HEADERS = [
  "Entity Type",
  "Bid Name",
  "Open Date",
  "Closed Date",
  "Countdown",
  "Status",
  "Share",
  "Follow",
];

const ROWS_COUNT = 10;

const BidTableSkeleton = () => {
  return (
    <div
  className="rounded-2xl bg-bidtable-glow text-white my-12 shadow-xl overflow-x-auto border-white border-2 border-solid relative max-h-screen overflow-y-auto"
  aria-busy="true"
>
      <table className="min-w-full table-auto text-sm text-center">
        <thead className="sticky top-0 bg-white/5 backdrop-blur-sm z-10">
          <tr className="text-white/80 text-xs border-b border-white/20">
            {HEADERS.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-4 font-inter text-base whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROWS_COUNT }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-white/10">
              {HEADERS.map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-4 font-inter">
                  {/* Share & Follow column shimmer circle */}
                  {(colIdx === 6 || colIdx === 7) ? (
                    <div className="h-5 w-5 shimmer rounded-full mx-auto"></div>
                  ) : (
                    <div
                      className={`shimmer bg-white/10 rounded mx-auto ${
                        colIdx === 1
                          ? "w-44 h-4" // Bid Name
                          : colIdx === 0
                          ? "w-24 h-4" // Entity
                          : colIdx === 5
                          ? "w-16 h-4" // Status
                          : "w-20 h-4" // Others
                      }`}
                    ></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BidTableSkeleton;
