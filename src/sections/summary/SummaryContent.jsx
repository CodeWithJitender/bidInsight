import React from "react";
import Unlock from "../../components/Unlock";

export default function SummaryContent() {
  const data = {
    head:"Unlock the Bids to View Score",
    p:"To view source links, save opportunities, and track bid deadlines, you need to sign in or create an account.",
    container: " p-4",
    link:"/"
  };
  return (
    <div className=" mt-5 ">
      <div className="container-fixed">
        <div className="summary">
          <h4 className="font-archivo font-semibold text-p xl:text-[30px]">
            Summary
          </h4>
          <p className="font-inter text-[22px] mt-2">
            The Ohio Department of Medicaid is soliciting bids for the renewal
            of the Omnivex software subscription, which supports digital signage
            by displaying video content on monitors in the lobby and operations
            area. Bidders must be authorized resellers, with preference given to
            those listed on the State Term Schedule (STS), and pricing must be
            compliant with or below STS contract levels.
          </p>
          <div className="text-center">
            <img src="line.png" className="mx-auto my-10" />
          </div>
          <Unlock data={data} container={""} />
        </div>
      </div>
    </div>
  );
}
