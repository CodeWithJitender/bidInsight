import React from "react";

const ShimmerSummaryCard = () => {
  return (
    <div className="w-full pt-32   bg-summary-glow shadow-xl border-white border-[1px] p-6 relative overflow-hidden">
      {/* Overall shimmer overlay glow */}
      <div className="absolute inset-0 shimmer opacity-10 pointer-events-none"></div>

      <div className="relative mx-auto w-[80%] pb-20 space-y-6">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-2">
            <div className="h-6 w-72 shimmer rounded-lg bg-white/10"></div>
            <div className="flex gap-6 text-sm">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-4 w-20 shimmer rounded-md bg-white/10"></div>
              ))}
            </div>
          </div>
          {/* Countdown Circle */}
          <div className="h-20 w-20 shimmer rounded-full bg-white/10"></div>
        </div>

        {/* Summary Text Block */}
        <div className="space-y-3">
          <div className="h-5 w-full shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-11/12 shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-10/12 shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-1/2 shimmer rounded-md bg-white/10"></div>
        </div>

        {/* Unlock Row */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-5 w-72 shimmer rounded-md bg-white/10"></div>
          <div className="h-8 w-28 shimmer rounded-full bg-white/10"></div>
        </div>
      </div>

         <div className="relative mx-auto w-[80%] space-y-6">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-2">
            <div className="h-6 w-72 shimmer rounded-lg bg-white/10"></div>
            <div className="flex gap-6 text-sm">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-4 w-20 shimmer rounded-md bg-white/10"></div>
              ))}
            </div>
          </div>
          {/* Countdown Circle */}
          {/* <div className="h-20 w-20 shimmer rounded-full bg-white/10"></div> */}
        </div>

        {/* Summary Text Block */}
        <div className="space-y-3">
          <div className="h-5 w-full shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-11/12 shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-10/12 shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-1/2 shimmer rounded-md bg-white/10"></div>
        </div>

        {/* Unlock Row */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-5 w-72 shimmer rounded-md bg-white/10"></div>
          <div className="h-8 w-28 shimmer rounded-full bg-white/10"></div>
        </div>
      </div>

       <div className="relative mx-auto w-[80%] space-y-6">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-2">
            <div className="h-6 w-72 shimmer rounded-lg bg-white/10"></div>
            <div className="flex gap-6 text-sm">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-4 w-20 shimmer rounded-md bg-white/10"></div>
              ))}
            </div>
          </div>
          {/* Countdown Circle */}
          {/* <div className="h-20 w-20 shimmer rounded-full bg-white/10"></div> */}
        </div>

        {/* Summary Text Block */}
        <div className="space-y-3">
          <div className="h-5 w-full shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-11/12 shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-10/12 shimmer rounded-md bg-white/10"></div>
          <div className="h-5 w-1/2 shimmer rounded-md bg-white/10"></div>
        </div>

        {/* Unlock Row */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-5 w-72 shimmer rounded-md bg-white/10"></div>
          <div className="h-8 w-28 shimmer rounded-full bg-white/10"></div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerSummaryCard;
