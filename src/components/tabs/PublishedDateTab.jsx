import React from "react";

const PublishedDateTab = ({
  filters = {},

}) => {
  const { publishedDate = {} } = filters;
  const { from = "", to = "" } = publishedDate;

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
              // No checked or onChange handlers
              className="accent-purple-600"
            />
            <span className="font-inter text-xl">Not Available</span>
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
              className="accent-purple-600"
            />
            <select
              disabled={false}
              className="border border-gray-300 rounded-md font-inter text-xl px-2 py-1 w-[200px]"
              defaultValue="7"
              // No onChange handler
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
              className="accent-purple-600"
            />
            <div>
              <div className="font-inter text-xl text-gray-800 mb-2">Starting</div>
              <input
                type="date"
                disabled={false}
                className="border font-inter text-xl border-gray-300 rounded-md px-2 py-1 w-[200px]"
                defaultValue={from}
                // no onChange
              />
            </div>
          </div>
          <div className="ml-6">
            <div className="font-inter text-xl text-gray-800 mb-2">Ending</div>
            <input
              type="date"
              disabled={false}
              className="border border-gray-300 rounded-md px-2 py-1 font-inter text-xl w-[200px]"
              defaultValue={to}
              // no onChange
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={() => {}}
          className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => {}}
          className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default PublishedDateTab;
