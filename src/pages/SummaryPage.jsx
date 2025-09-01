// // 1. UPDATED SummaryPage.js - Add similar bids API call
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import BidHeader from "../sections/summary/BidHeader";
// import SummaryContent from "../sections/summary/SummaryContent";
// import BidTracking from "../sections/summary/BidTracking";
// import AiFeature from "../sections/summary/AiFeature";
// import SimilarBids from "../sections/summary/SimilarBids";
// import { getBids } from "../services/bid.service.js";
// import { similarBids } from "../services/user.service.js"; // 🔥 Import similar bids API

// function SummaryPage() {
//   const { id } = useParams();
//   const [bid, setBid] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // 🔥 NEW: State for similar bids
//   const [similarBidsData, setSimilarBidsData] = useState([]);
//   const [similarBidsLoading, setSimilarBidsLoading] = useState(false);
//   const [similarBidsError, setSimilarBidsError] = useState(null);
  
//   console.log(id, "ID from URL");

//   const fallback = {
//     bid_name: "Unknown Bid",
//     jurisdiction: "Unknown Organization",
//     state: { name: "Unknown Location" },
//     open_date: "-",
//     closing_date: "-",
//     source: "#",
//   };

//   // Existing bid fetch useEffect
//   useEffect(() => {
//     const fetchBid = async () => {
//       try {
//         const data = await getBids(id);
//         console.log(data, "Bid data fetched");
//         setBid(data);
//       } catch (err) {
//         console.error("❌ Failed to fetch bid", err);
//         setBid(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBid();
//   }, [id]);

//   // 🔥 NEW: Similar bids fetch useEffect
//   useEffect(() => {
//     const fetchSimilarBids = async () => {
//       if (!id) return;
      
//       setSimilarBidsLoading(true);
//       setSimilarBidsError(null);
      
//       try {
//         const data = await similarBids(id); // 🔥 API call with bid ID
//         console.log(data, "🔥 Similar bids fetched");
//         setSimilarBidsData(data);
//         console.log("🔥 Similar bids loaded:", data);
//       } catch (err) {
//         console.error("❌ Failed to fetch similar bids:", err);
//         setSimilarBidsError("Failed to load similar bids");
//         setSimilarBidsData([]); // Set empty array on error
//       } finally {
//         setSimilarBidsLoading(false);
//       }
//     };

//     // Only fetch similar bids after main bid is loaded
//     if (bid && id) {
//       fetchSimilarBids();
//     }
//   }, [id, bid]); // Depend on both id and bid

//   const bidData = bid || fallback;
//   console.log("Bid Data:", bidData);


//   return (
//     <div className="py-[120px] bg-blue">
//       <div className="min-h-screen bg-gradient-to-br text-white p-4 sm:p-6 lg:p-10">
//         <div className="max-w-7xl mx-auto space-y-6">
//           {/* Header Card */}


//           <div className="rounded-2xl bg-white/5 backdrop-blur-md shadow-xl">
//             <BidHeader
//               title={bidData.bid_name || fallback.bid_name}
//               org={bidData.jurisdiction || fallback.jurisdiction}
//               location={bidData.state?.name || fallback.state.name}
//               postedDate={
//                 bidData.open_date
//                   ? new Date(bidData.open_date).toLocaleDateString()
//                   : fallback.open_date
//               }
//               deadline={bidData.closing_date || fallback.closing_date}
//               sourceLink={bidData.source || fallback.source}
//             />
//           </div>



//           {/* Summary Section */}
//           <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
//             <SummaryContent bidData={bidData} />
//           </div>

//           {/* Bid Tracking + AI Features + Similar Bids */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//             <div className="col-span-2 space-y-4">
//               <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
//                 <BidTracking bidData={bidData} />
//               </div>
              
//               {/* 🔥 UPDATED: Pass similar bids data as props */}
//               <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
//                 <SimilarBids 
//                   bidData={bidData}
//                   similarBids={similarBidsData.slice(0,2)} // 🔥 Similar bids array
//                   loading={similarBidsLoading}   // 🔥 Loading state
//                   error={similarBidsError}       // 🔥 Error state
//                 />
//               </div>
//             </div>

//             <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
//               <AiFeature bidData={bidData} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SummaryPage;














// 1. UPDATED SummaryPage.js - Add similar bids API call
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BidHeader from "../sections/summary/BidHeader";
import SummaryContent from "../sections/summary/SummaryContent";
import BidTracking from "../sections/summary/BidTracking";
import AiFeature from "../sections/summary/AiFeature";
import SimilarBids from "../sections/summary/SimilarBids";
import { getBids } from "../services/bid.service.js";
import { similarBids } from "../services/user.service.js"; // 🔥 Import similar bids API

function SummaryPage() {
  const { id } = useParams();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔥 NEW: State for similar bids
  const [similarBidsData, setSimilarBidsData] = useState([]);
  const [similarBidsLoading, setSimilarBidsLoading] = useState(false);
  const [similarBidsError, setSimilarBidsError] = useState(null);
  
  console.log(id, "ID from URL");

  const fallback = {
    bid_name: "Unknown Bid",
    jurisdiction: "Unknown Organization",
    state: { name: "" },
    open_date: "-",
    closing_date: "-",
    source: "#",
  };

  // Existing bid fetch useEffect
  useEffect(() => {
    const fetchBid = async () => {
      try {
        const data = await getBids(id);
        console.log(data, "Bid data fetched");
        setBid(data);
      } catch (err) {
        console.error("❌ Failed to fetch bid", err);
        setBid(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBid();
  }, [id]);

  // 🔥 NEW: Similar bids fetch useEffect
  useEffect(() => {
    const fetchSimilarBids = async () => {
      if (!id) return;
      
      setSimilarBidsLoading(true);
      setSimilarBidsError(null);
      
      try {
        const data = await similarBids(id); // 🔥 API call with bid ID
        console.log(data, "🔥 Similar bids fetched");
        setSimilarBidsData(data);
        console.log("🔥 Similar bids loaded:", data);
      } catch (err) {
        console.error("❌ Failed to fetch similar bids:", err);
        setSimilarBidsError("Failed to load similar bids");
        setSimilarBidsData([]); // Set empty array on error
      } finally {
        setSimilarBidsLoading(false);
      }
    };

    // Only fetch similar bids after main bid is loaded
    if (bid && id) {
      fetchSimilarBids();
    }
  }, [id, bid]); // Depend on both id and bid

  const bidData = bid || fallback;
  console.log("Bid Data:", bidData);

  // 🔥 Determine location based on entity_type
  const getLocation = () => {
    if (bidData.entity_type === "Federal") {
      return "sam.gov";
    }
    return bidData.state?.name || fallback.state.name;
  };

  return (
    <div className="py-[120px] bg-blue">
      <div className="min-h-screen bg-gradient-to-br text-white p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Card */}

          <div className="rounded-2xl bg-white/5 backdrop-blur-md shadow-xl">
            <BidHeader
              title={bidData.bid_name || fallback.bid_name}
              org={bidData.jurisdiction || fallback.jurisdiction}
              location={getLocation()} // 🔥 Use the dynamic location function
              postedDate={
                bidData.open_date
                  ? new Date(bidData.open_date).toLocaleDateString()
                  : fallback.open_date
              }
              deadline={bidData.closing_date || fallback.closing_date}
              sourceLink={bidData.source || fallback.source}
            />
          </div>

          {/* Summary Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
            <SummaryContent bidData={bidData} />
          </div>

          {/* Bid Tracking + AI Features + Similar Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
                <BidTracking bidData={bidData} />
              </div>
              
              {/* 🔥 UPDATED: Pass similar bids data as props */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
                <SimilarBids 
                  bidData={bidData}
                  similarBids={similarBidsData.slice(0,2)} // 🔥 Similar bids array
                  loading={similarBidsLoading}   // 🔥 Loading state
                  error={similarBidsError}       // 🔥 Error state
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
              <AiFeature bidData={bidData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;