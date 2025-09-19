import React from "react";
import Unlock from "../../components/Unlock";
import DOMPurify from "dompurify";

export default function SummaryContent({ bidData = {} }) {
  console.log(bidData);
  const summaryText = bidData.description?.trim();

   const cleanSummary = DOMPurify.sanitize(
    summaryText?.replace(/[-]{2,}/g, "") || "No summary available at the moment."
  );


  const data = {
    head: "Unlock the Bids to View Compatibility Metrics",
    p: "To view source links, save opportunities, and track bid deadlines, you need to upgrade your plan.",
    container: "p-4",
    link: "/pricing",
  };

  return (
    <div className="mt-5">
      <div className="container-fixed">
       <div className="summary">
  <h4 className="font-archivo font-semibold text-p xl:text-[30px]">
    Summary
  </h4>
  <p
    className="font-inter text-[22px] mt-2"
    dangerouslySetInnerHTML={{
      __html: cleanSummary || "No summary available at the moment."
    }}
  />
  <div className="text-center">
    <img src="/line.png" alt="divider" className="mx-auto my-10" />
  </div>
  <Unlock data={data} />
</div>

      </div>
    </div>
  );
}
