import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

function PublishedDateTab({
  filters = {},
  setFilters = () => { },
  setActiveTab = () => { },
  searchOption = "create",
  setShowValidation = () => { },
  setTriggerSave = () => { },
  onSubmit = () => { },
  selectedSavedSearch = {},
  defaultSearch = false,
  onClose = () => { },
  onApply = () => { },
}) {
  const { from = "", to = "" } = filters.publishedDate || {};
  const today = new Date().toISOString().slice(0, 10);
  const [manualSelected, setManualSelected] = useState("");


  const loginDateRawRedux = useSelector((state) => state.login?.user?.last_login);

// Check localStorage if Redux doesn't have login info
let loginDateRaw = loginDateRawRedux;

if (!loginDateRaw) {
  try {
    const authTokens = JSON.parse(localStorage.getItem("auth_tokens"));
    loginDateRaw = authTokens?.user?.last_login || null;
  } catch (error) {
    console.error("Error reading auth_tokens from localStorage:", error);
  }
}

const loginDate = loginDateRaw
  ? format(new Date(loginDateRaw), "dd MMM yyyy")
  : "Not Available";


   useEffect(() => {
  const isValidDate = (dateStr) => !isNaN(new Date(dateStr));

  if (!isValidDate(from) || !isValidDate(to)) {
    setManualSelected("timeline");
    return;
  }

  if (from === to) {
    setManualSelected("date");
    return;
  }

  const diff = Math.floor(
    (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)
  );

  const toDate = new Date(to).toISOString().slice(0, 10);

  if (toDate === today && [7, 30, 90].includes(diff)) {
    setManualSelected("within");
  } else {
    setManualSelected("timeline");
  }
   }, [from, to]);



  const handleRadioChange = (value) => {
    setManualSelected(value);
    if (value === "date") {
      setFilters((prev) => ({
        ...prev, 
        publishedDate: { from: today, to: today },
      }));
    } else if (value === "within") {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setFilters((prev) => ({
        ...prev,
        publishedDate: {
          from: past.toISOString().slice(0, 10),
          to: today,
        },
      }));
    } else if (value === "timeline") {
      setFilters((prev) => ({
        ...prev,
        publishedDate: { from: "", to: "" },
      }));
    }
  };

  const handleCancel = () => {
    setFilters((prev) => ({
      ...prev,
      publishedDate: { from: "", to: "" },
    }));
    setManualSelected("");
    onApply?.();
  };

  const handleSearchClick = () => {
    console.log("Search button clicked", { searchOption, filters, selectedSavedSearch });

    const isCreateMode = searchOption === 'create';
    const isReplaceMode = searchOption === 'replace';
    const nameMissing = !filters.searchName?.trim();

    if (isCreateMode && nameMissing) {
      setShowValidation?.(true);
      setActiveTab?.('Save Search Form');
      return;
    }

    if (isCreateMode) {
      setTriggerSave?.(true);
    } else if (isReplaceMode) {
      const payload = {
        action: "replace",
        name: selectedSavedSearch?.name,
        id: selectedSavedSearch?.id,
        isDefault: defaultSearch,
        filters: { ...filters },
      };
      onSubmit?.(payload);
      setShowValidation?.(false);
      onClose?.();
    } else {
      onApply?.();
      onClose?.();
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-US");

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div className="flex flex-col gap-6">
        {/* Date */}
        <div>
          <label className="font-semibold block font-inter text-p mb-2">
            Last Login
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="publishedDateFilter"
              value="date"
              checked={manualSelected === "date"}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="accent-purple-600"
            />
            <span className="font-inter text-xl">{loginDate}</span>
          </div>
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
              checked={manualSelected === "within"}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="accent-purple-600"
            />
            <select
              disabled={manualSelected !== "within"}
              className="border border-gray-300 rounded-md font-inter text-xl px-2 py-1 w-[200px]"
              value={
                manualSelected === "within" && from && to && !isNaN(new Date(from)) && !isNaN(new Date(to))
                  ? Math.floor((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24))
                  : ""
              }

              onChange={(e) => {
                const days = parseInt(e.target.value);
                const past = new Date();
                past.setDate(past.getDate() - days);
                setFilters((prev) => ({
                  ...prev,
                  publishedDate: {
                    from: past.toISOString().slice(0, 10),
                    to: today,
                  },
                }));
              }}
            >
              {/* <option value="">-Select-</option> */}
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
              checked={manualSelected === "timeline"}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="accent-purple-600"
            />
            <div>
              <div className="font-inter text-xl text-gray-800 mb-2">
                Starting
              </div>
              <input
                type="date"
                disabled={manualSelected !== "timeline"}
                className="border font-inter text-xl border-gray-300 rounded-md px-2 py-1 w-[200px]"
                value={manualSelected === "timeline" ? from : ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    publishedDate: {
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
                  publishedDate: {
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
          onClick={handleSearchClick}
          className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default PublishedDateTab;
