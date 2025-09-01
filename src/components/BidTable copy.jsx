import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";

// Helper to format date
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// Countdown in days
function getCountdown(closingDateStr) {
  if (!closingDateStr) return "-";
  const closing = new Date(closingDateStr);
  const now = new Date();
  const diffInMs = closing.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  if (isNaN(diffInDays)) return "-";
  if (diffInDays < 0) return "Closed";
  if (diffInDays === 0) return "Closes today";
  return `${diffInDays} days`;
}

// Convert rows to CSV
const convertToCSV = (rows) => {
  if (!rows?.length) return "";

  const headers = [
    "Jurisdiction",
    "Bid Name",
    "Open Date",
    "Closed Date",
    "Countdown",
    "Status",
  ];

  const csvRows = rows.map((bid) => [
    `"${bid.jurisdiction ?? ""}"`,
    `"${bid.bid_name ?? ""}"`,
    `"${formatDate(bid.open_date)}"`,
    `"${formatDate(bid.closing_date)}"`,
    `"${getCountdown(bid.closing_date)}"`,
    `"${typeof bid.status === "boolean" ? (bid.status ? "Active" : "Inactive") : bid.status}"`,
  ]);

  return [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
};

// Sort logic
const sortFunctions = {
  az: (a, b, key) => {
    const aVal = (a[key] || "").toString().toLowerCase();
    const bVal = (b[key] || "").toString().toLowerCase();
    return aVal.localeCompare(bVal);
  },
  za: (a, b, key) => {
    const aVal = (a[key] || "").toString().toLowerCase();
    const bVal = (b[key] || "").toString().toLowerCase();
    return bVal.localeCompare(aVal);
  },
};

const BidTable = forwardRef(({ bids = [] }, ref) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, order: "az" });

  useEffect(() => {
    setData(bids);
  }, [bids]);

  const handleSort = (key, order) => {
    const sorted = [...data].sort((a, b) => sortFunctions[order](a, b, key));
    setData(sorted);
    setSortConfig({ key, order });
  };

  const handleRowClick = (id) => navigate(`/summary/${id}`);

  const handleShare = (e, id) => {
    e.stopPropagation();
    const url = `${window.location.origin}/summary/${id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("✅ Summary link copied to clipboard!"))
      .catch(() => alert("❌ Failed to copy the link."));
  };

  const exportToCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");
    link.href = url;
    link.setAttribute("download", `bids_export_${timestamp}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Expose method to parent via ref
  useImperativeHandle(ref, () => ({
    exportToCSV,
  }));

  const truncate = (text) => {
    if (!text) return "-";
    return text.length > 30 ? text.slice(0, 30) + "..." : text;
  };

  const renderSelect = (key) => (
    <select
      onChange={(e) => handleSort(key, e.target.value)}
      className="bg-transparent  text-white text-xs outline-none w-4"
      value={sortConfig.key === key ? sortConfig.order : ""}
    >
      <option value=""></option>
      <option value="az" className="text-blue-900 font-bold">A → Z</option>
      <option value="za" className="text-blue-900 font-bold">Z → A</option>
    </select>
  );

  return (
    <div className="rounded-2xl bg-btn text-white my-[50px] p-4 shadow-xl overflow-x-auto border-white border-2 border-solid relative">
      {/* <div className="flex justify-end mb-3">
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          Export CSV
        </button>
      </div> */}

      <table className="min-w-full table-auto text-sm text-center">
        <thead className="">
          <tr className="text-white/80 text-xs border-b border-white/20">
            <th className="px-4 py-2 font-inter text-lg">
              Entity Type {renderSelect("jurisdiction")}
            </th>
            <th className="px-4 py-2 font-inter text-lg">
              Bid Name {renderSelect("bid_name")}
            </th>
            <th className="px-4 py-2 font-inter text-lg">
              Open Date {renderSelect("open_date")}
            </th>
            <th className="px-4 py-2 font-inter text-lg">
              Closed Date {renderSelect("closing_date")}
            </th>
            <th className="px-4 py-2 font-inter text-lg">
              Countdown {renderSelect("closing_date")}
            </th>
            <th className="px-4 py-2 font-inter text-lg">
              Status {renderSelect("status")}
            </th>
            <th className="px-4 py-2 font-inter text-lg text-center">Share</th>
            <th className="px-4 py-2 font-inter text-lg text-center">Follow</th>
          </tr>
        </thead>
        <tbody>
          {data.map((bid) => {
            const statusLabel = bid.bid_type || "Unknown";

            const countdownRaw = getCountdown(bid.closing_date);
            let countdownDisplay = countdownRaw;

            if (bid.status === false) {
              // ✅ Show "Closed" directly for inactive
              countdownDisplay = "Closed";
            } else if (!["-", "Closed", "Closes today"].includes(countdownRaw)) {
              const daysMatch = countdownRaw.match(/\d+/);
              const days = daysMatch ? parseInt(daysMatch[0], 10) : 0;

              const years = Math.floor(days / 365);
              const months = Math.floor((days % 365) / 30);
              const remainingDays = days % 30;

              let countdownParts = [];

              if (years > 0) countdownParts.push(`${years}y`);
              if (months > 0) countdownParts.push(`${months}m`);

              // ✅ Only show days if no years or months
              if (years === 0 && months === 0) {
                countdownParts.push(`${remainingDays}d`);
              }

              countdownDisplay = countdownParts.join(" ");
            }


            // ✅ If bid is inactive, force "Closed"
            if (bid.status === false) {
              countdownDisplay = "Closed";
            }

            return (
              <tr
                key={bid.id}
                className="border-b border-white/10 hover:bg-white/5 transition cursor-pointer"
                onClick={() => handleRowClick(bid.id)}
              >
                <td className="px-4 py-4 font-semibold font-inter">
                  {truncate(bid.entity_type)}
                </td>
                <td className="px-4 py-4 font-medium font-inter">
                  {truncate(bid.bid_name)}
                </td>
                <td className="px-4 py-4 font-medium font-inter">
                  {formatDate(bid.open_date)}
                </td>
                <td className="px-4 py-4 font-medium font-inter">
                  {formatDate(bid.closing_date)}
                </td>
                <td className="px-4 py-4 font-medium font-inter" title={countdownRaw}>
                  {countdownDisplay}
                </td>
                <td className="px-4 py-4 font-medium font-inter">
                  {statusLabel}
                </td>
                <td className="btn-box px-4 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Prevents <tr> click
                      if (navigator.share) {
                        navigator
                          .share({
                            title: `Bid: ${bid.bid_name}`,
                            text: `Check out this bid from ${bid.jurisdiction}`,
                            url: `${window.location.origin}/summary/${bid.id}`,
                          })
                          .then(() => console.log("Shared successfully!"))
                          .catch((err) => console.error("Share failed:", err));
                      } else {
                        alert("Sharing is not supported on this device.");
                      }
                    }}
                  >
                    <i className="fas fa-share-alt"></i>
                  </button>
                </td>

                <td className="px-4 py-4 text-center">
                  <button>
                    <i
                      className={`fas ${bid.followed ? "fa-minus-circle" : "fa-plus-circle"}`}
                    ></i>
                  </button>
                </td>
              </tr>
            );
          })}

        </tbody>

      </table>
    </div>
  );
});

export default BidTable;
