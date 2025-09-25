import React from "react";
import Unlock from "../../components/Unlock";

function BidTracking() {
  const data = {
    head: "Unlock the Bid Tracking",
    p: "To view source links, save opportunities, and track bid deadlines, you need to upgrade your plan.",
    container: "flex-col justify-center max-w-[500px] mx-auto text-center p-4",
    imgSize: "w-20",
    link: "/",
  };

  return (
    <div className="bg-summary bg-image border border-white text-white p-6 rounded-2xl">
      <div className="container-fixed">
        <h1 className="font-archivo font-semibold text-xl md:text-p xl:text-[30px]">
          Bid Tracking
        </h1>
        <Unlock data={data} />
      </div>
    </div>
  );
}

export default BidTracking;