import React from "react";
import Unlock from "../../components/Unlock";
import line from "../../../public/line.png";

export default function SummaryContent({ bidData = {} }) {
  console.log(bidData);

  const summaryText = bidData.description?.trim();

  const data = {
    head: "Unlock the Bids to View Score",
    p: "To view source links, save opportunities, and track bid deadlines, you need to sign in or create an account.",
    container: "p-4",
    link: "/",
  };

  return (
    <div className="mt-5">
      <div className="container-fixed">
        <div className="summary">
          <h4 className="font-archivo font-semibold text-p xl:text-[30px]">
            Summary
          </h4>
          <p className="font-inter text-[22px] mt-2">
            {summaryText || "No summary available at the moment."}
          </p>
          <div className="text-center">
            <img src={line} alt="divider" className="mx-auto my-10" />
          </div>
          <Unlock data={data} />
        </div>
      </div>
    </div>
  );
}
