import React, { useState, useEffect } from "react";


const ClosingDateTab = ({
  filters = {},
  setFilters = () => {},
  onApply = () => {},
  searchOption = "create",
  setShowValidation = () => {},
  setActiveTab = () => {},
  setTriggerSave = () => {},
}) => {
  const { closingDate = {} } = filters;
  const { type = "", within = "", date = "", from = "", to = "" } = closingDate;


  // Local state for component
  const [selectedType, setSelectedType] = useState(type || "");
  const [withinDays, setWithinDays] = useState(within || "");
  const [singleDate, setSingleDate] = useState(date || "");
  const [fromDate, setFromDate] = useState(from || "");
  const [toDate, setToDate] = useState(to || "");


  const today = new Date().toISOString().slice(0, 10);


  // Function to calculate date ranges for "within" option
  const calculateDateRange = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - parseInt(days)); // Changed to minus for "last" days
   
    return {
      after: pastDate.toISOString().split('T')[0], // YYYY-MM-DD format
      before: today.toISOString().split('T')[0]
    };
  };


  // Update filters when selections change - Fixed version
  const updateFilters = (type, days = "", singleDateValue = "", fromDateValue = "", toDateValue = "") => {
    let updatedFilters = { ...filters };
   
    if (type === "date") {
      // Single date selection - set both after and before to same date
      updatedFilters.closingDate = {
        type: "date",
        date: singleDateValue,
        within: "",
        from: "",
        to: "",
        // ✅ API parameters
        after: singleDateValue,
        before: singleDateValue
      };
    } else if (type === "within") {
      const dateRange = calculateDateRange(days);
      updatedFilters.closingDate = {
        type: "within",
        within: days,
        date: "",
        from: "",
        to: "",
        // ✅ API parameters
        after: dateRange.after,
        before: dateRange.before
      };
    } else if (type === "timeline") {
      updatedFilters.closingDate = {
        type: "timeline",
        within: "",
        date: "",
        from: fromDateValue,
        to: toDateValue,
        // ✅ API parameters
        after: fromDateValue,
        before: toDateValue
      };
    } else {
      // Clear filters
      updatedFilters.closingDate = {
        type: "",
        within: "",
        date: "",
        from: "",
        to: "",
        after: "",
        before: ""
      };
    }


    if (setFilters) {
      setFilters(updatedFilters);
    }
  };


  // Handle radio button change - Fixed version
  const handleTypeChange = (type) => {
    setSelectedType(type);
   
    // Clear other fields when switching type
    if (type === "date") {
      setWithinDays("");
      setFromDate("");
      setToDate("");
      updateFilters(type, "", singleDate, "", "");
    } else if (type === "within") {
      setSingleDate("");
      setFromDate("");
      setToDate("");
      // Don't call updateFilters here, wait for dropdown selection
    } else if (type === "timeline") {
      setSingleDate("");
      setWithinDays("");
      updateFilters(type, "", "", fromDate, toDate);
    } else {
      // Clear all local state when clearing
      setWithinDays("");
      setSingleDate("");
      setFromDate("");
      setToDate("");
      updateFilters(type, "", "", "", "");
    }
  };


  // Handle single date change
  const handleSingleDateChange = (date) => {
    setSingleDate(date);
    if (selectedType === "date") {
      updateFilters("date", "", date, "", "");
    }
  };


  // Handle within days change
  const handleWithinChange = (days) => {
    setWithinDays(days);
    if (selectedType === "within" && days) {
      // Ensure selectedType stays as "within"
      const updatedFilters = { ...filters };
      const dateRange = calculateDateRange(days);
      updatedFilters.closingDate = {
        type: "within",
        within: days,
        date: "",
        from: "",
        to: "",
        // ✅ API parameters
        after: dateRange.after,
        before: dateRange.before
      };
     
      if (setFilters) {
        setFilters(updatedFilters);
      }
    }
  };


  // Handle timeline dates change
  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (selectedType === "timeline") {
      updateFilters("timeline", "", "", date, toDate);
    }
  };


  const handleToDateChange = (date) => {
    setToDate(date);
    if (selectedType === "timeline") {
      updateFilters("timeline", "", "", fromDate, date);
    }
  };


  // Initialize component state from filters - only on mount or when explicitly cleared
  useEffect(() => {
    // Only sync from props if local state is empty (initial load or after clear)
    if (!selectedType && closingDate.type) {
      setSelectedType(closingDate.type);
      setWithinDays(closingDate.within || "");
      setSingleDate(closingDate.date || "");
      setFromDate(closingDate.from || "");
      setToDate(closingDate.to || "");
    }
  }, [closingDate.type]); // Only depend on type, not all fields


  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="flex flex-col gap-6">
        {/* Single Date */}
        <div>
          <label className="font-semibold block font-inter text-p mb-2">Date</label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="closingDateFilter"
              value="date"
              checked={selectedType === "date"}
              onChange={() => handleTypeChange("date")}
              className="accent-purple-600"
            />
            <input
              type="date"
              disabled={selectedType !== "date"}
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px] disabled:bg-gray-100"
              value={singleDate}
              onChange={(e) => handleSingleDateChange(e.target.value)}
              min={today} // Prevent past dates for closing date
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
              checked={selectedType === "within"}
              onChange={() => handleTypeChange("within")}
              className="accent-purple-600"
            />
            <select
              disabled={selectedType !== "within"}
              className="border border-gray-300 rounded-md font-inter text-xl px-2 py-1 w-[200px] disabled:bg-gray-100"
              value={withinDays}
              onChange={(e) => handleWithinChange(e.target.value)}
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
              checked={selectedType === "timeline"}
              onChange={() => handleTypeChange("timeline")}
              className="accent-purple-600"
            />
            <div>
              <div className="font-inter text-xl text-gray-800 mb-2">Starting</div>
              <input
                type="date"
                disabled={selectedType !== "timeline"}
                className="border font-inter text-xl border-gray-300 rounded-md px-2 py-1 w-[200px] disabled:bg-gray-100"
                value={fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
                min={today} // Prevent past dates
              />
            </div>
          </div>
          <div className="ml-6">
            <div className="font-inter text-xl text-gray-800 mb-2">Ending</div>
            <input
              type="date"
              disabled={selectedType !== "timeline"}
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px] disabled:bg-gray-100"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              min={fromDate || today} // Ending date should be after starting date
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default ClosingDateTab;
