import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";


const PublishedDateTab = ({ filters = {}, setFilters }) => {
  const { publishedDate = {} } = filters;
  const { type = "", within = "7", from = "", to = "" } = publishedDate;


  const lastLogin = useSelector((state) => state.login?.user?.last_login);
  const formattedLastLogin = lastLogin
    ? new Date(lastLogin).toLocaleDateString("en-US", {
        dateStyle: "medium",
      })
    : "Not Available";


  const [selectedType, setSelectedType] = useState(type || "");
  const [withinDays, setWithinDays] = useState(within || "7");
  const [fromDate, setFromDate] = useState(from || "");
  const [toDate, setToDate] = useState(to || "");


  // Sync local state with incoming filters
  useEffect(() => {
    setSelectedType(publishedDate.type || "");
    setWithinDays(publishedDate.within || "7");
    setFromDate(publishedDate.from || "");
    setToDate(publishedDate.to || "");
  }, [publishedDate]);


  const calculateDateRange = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - parseInt(days));
    return {
      after: pastDate.toISOString().split("T")[0],
      before: today.toISOString().split("T")[0],
    };
  };


  const updateFilters = (
    type,
    days = withinDays,
    fromDateVal = fromDate,
    toDateVal = toDate
  ) => {
    const updated = { ...filters };


    if (type === "within") {
      const { after, before } = calculateDateRange(days);
      updated.publishedDate = {
        type,
        within: days,
        from: "",
        to: "",
        after,
        before,
      };
    } else if (type === "timeline") {
      updated.publishedDate = {
        type,
        within: "",
        from: fromDateVal,
        to: toDateVal,
        after: fromDateVal,
        before: toDateVal,
      };
    } else if (type === "lastLogin") {
      const loginDate = lastLogin
        ? lastLogin.split("T")[0]
        : "";
      updated.publishedDate = {
        type,
        within: "",
        from: "",
        to: "",
        after: loginDate,
        before: loginDate,
      };
    } else {
      updated.publishedDate = {
        type: "",
        within: "7",
        from: "",
        to: "",
        after: "",
        before: "",
      };
    }


    setFilters(updated);
  };


  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (type === "within") {
      updateFilters(type, withinDays);
    } else if (type === "timeline") {
      updateFilters(type, withinDays, fromDate, toDate);
    } else {
      updateFilters(type);
    }
  };


  const handleWithinChange = (days) => {
    setWithinDays(days);
    if (selectedType === "within") {
      updateFilters("within", days);
    }
  };


  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (selectedType === "timeline") {
      updateFilters("timeline", withinDays, date, toDate);
    }
  };


  const handleToDateChange = (date) => {
    setToDate(date);
    if (selectedType === "timeline") {
      updateFilters("timeline", withinDays, fromDate, date);
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="flex flex-col gap-6">


        {/* Last Login */}
        <div>
          <label className="font-semibold block font-inter text-p mb-2">
            Last Login
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="publishedDateFilter"
              value="lastLogin"
              checked={selectedType === "lastLogin"}
              onChange={() => handleTypeChange("lastLogin")}
              className="accent-purple-600"
            />
            <span className="font-inter text-xl">{formattedLastLogin}</span>
          </label>
        </div>


        {/* Within */}
        <div>
          <label className="font-semibold block font-inter text-p mb-2">
            Within
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="publishedDateFilter"
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
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>


        {/* Timeline */}
        <div>
          <label className="font-semibold block font-inter text-p mb-2">
            Timeline
          </label>
          <div className="flex items-start space-x-2 mb-1">
            <input
              type="radio"
              name="publishedDateFilter"
              value="timeline"
              checked={selectedType === "timeline"}
              onChange={() => handleTypeChange("timeline")}
              className="accent-purple-600"
            />
            <div>
              <div className="font-inter text-xl text-gray-800 mb-2">
                Starting
              </div>
              <input
                type="date"
                disabled={selectedType !== "timeline"}
                className="border font-inter text-xl border-gray-300 rounded-md px-2 py-1 w-[200px] disabled:bg-gray-100"
                value={fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default PublishedDateTab;
