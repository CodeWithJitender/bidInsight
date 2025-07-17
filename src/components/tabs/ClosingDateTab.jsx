import React, { useEffect, useState } from "react";

const ClosingDateTab = ({ filters = {}, setFilters = () => {}, onApply = () => {} }) => {
  const today = new Date().toISOString().slice(0, 10);
  const { from = "", to = "" } = filters.closingDate || {};

  const [manualSelected, setManualSelected] = useState("");

  // Sync selection when filters.closingDate changes externally
  useEffect(() => {
    if (!from || !to) {
      setManualSelected("timeline");
    }
    else if (from === to) {
      setManualSelected("date");
    } else {
      const diff = Math.floor((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));
      if (to === today && [7, 30, 90].includes(diff)) {
        setManualSelected("within");
      } else {
        setManualSelected("timeline");
      }
    }
  }, [from, to]);

  const handleRadioChange = (type) => {
    setManualSelected(type);
    if (type === "date") {
      setFilters((prev) => ({
        ...prev,
        closingDate: { from: today, to: today },
      }));
    } else if (type === "within") {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setFilters((prev) => ({
        ...prev,
        closingDate: {
          from: past.toISOString().slice(0, 10),
          to: today,
        },
      }));
    } else if (type === "timeline") {
      setFilters((prev) => ({
        ...prev,
        closingDate: { from: "", to: "" },
      }));
    }
  };

  const handleCancel = () => {
    setFilters((prev) => ({
      ...prev,
      closingDate: { from: "", to: "" },
    }));
    setManualSelected(""); // reset UI
    onApply?.();
  };

  const handleApply = () => {
    onApply?.();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="flex flex-col gap-6">
        {/* Search bar */}
        {/* <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search titles or organization or location"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
              size={18}
            />
          </div>
        </div> */}

        {/* Date */}
        <div>
          <label className="font-semibold block font-inter text-p mb-2">Date</label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="closingDateFilter"
              value="date"
              checked={manualSelected === "date"}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="accent-purple-600"
            />
            <input
              type="date"
              disabled={manualSelected !== "date"}
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px]"
              value={manualSelected === "date" ? from : ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  closingDate: { from: e.target.value, to: e.target.value },
                }))
              }
            />
          </div>
        </div>

        {/* Within */}
        <div>
          <label className="font-semibold block font-inter text-p mb-2">Within</label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="closingDateFilter"
              value="within"
              checked={manualSelected === "within"}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="accent-purple-600"
            />
            <select
              disabled={manualSelected !== "within"}
              className="border border-gray-300 rounded-md font-inter text-xl px-2 py-1 w-[200px]"
              value={
                manualSelected === "within"
                  ? String((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24))
                  : ""
              }
              onChange={(e) => {
                const days = parseInt(e.target.value);
                const past = new Date();
                past.setDate(past.getDate() - days);
                setFilters((prev) => ({
                  ...prev,
                  closingDate: {
                    from: past.toISOString().slice(0, 10),
                    to: today,
                  },
                }));
              }}
            >
              <option value="">-Select-</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <label className="font-semibold block font-inter text-p mb-2">Timeline</label>
          <div className="flex items-start space-x-2 mb-1">
            <input
              type="radio"
              name="closingDateFilter"
              value="timeline"
              checked={manualSelected === "timeline"}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="accent-purple-600"
            />
            <div>
              <div className="font-inter text-xl text-gray-800 mb-2">Starting</div>
              <input
                type="date"
                disabled={manualSelected !== "timeline"}
                className="border font-inter text-xl border-gray-300 rounded-md px-2 py-1 w-[200px]"
                value={manualSelected === "timeline" ? from : ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    closingDate: {
                      from: e.target.value,
                      to: to || "",
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="ml-6">
            <div className="font-inter text-xl text-gray-800 mb-2">Ending</div>
            <input
              type="date"
              disabled={manualSelected !== "timeline"}
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px]"
              value={manualSelected === "timeline" ? to : ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  closingDate: {
                    from: from || "",
                    to: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={handleCancel}
          className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
        >
          Cancel
        </button>

        <button
          onClick={handleApply}
          className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default ClosingDateTab;