// FIXED SummaryPage.js - No popup notifications + API error handling
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BidHeader from "../sections/summary/BidHeader";
import SummaryContent from "../sections/summary/SummaryContent";
import BidTracking from "../sections/summary/BidTracking";
import AiFeature from "../sections/summary/AiFeature";
import SimilarBids from "../sections/summary/SimilarBids";
import { BookMarkedBids, getBids, totalBookmarkedBids, deleteBookmarkedBid } from "../services/bid.service.js";
import { similarBids } from "../services/user.service.js";
import SavedSearchPopup from "../components/SavedSearchPopup.jsx"; 
import { usePlan } from "../hooks/usePlan";

function SummaryPage() {
  const { id } = useParams();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);

  // Similar bids state
  const [similarBidsData, setSimilarBidsData] = useState([]);
  const [similarBidsLoading, setSimilarBidsLoading] = useState(false);
  const [similarBidsError, setSimilarBidsError] = useState(null);
  
  // Bookmark state
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedCount, setBookmarkedCount] = useState(0);
  
  // ✅ SavedSearchPopup state for API limit errors
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [limitPopupData, setLimitPopupData] = useState({
    title: "",
    message: "",
    upgradeButtonText: "Upgrade Plan",
    cancelButtonText: "Cancel"
  });
  
  const { planInfo, validateFeatureUsage, getFeatureRestriction } = usePlan();
  console.log(id, "ID from URL");

  const fallback = {
    bid_name: "Unknown Bid",
    jurisdiction: "Unknown Organization",
    state: { name: "" },
    open_date: "-",
    closing_date: "-",
    source: "#",
  };

  // Fetch bookmarked count
  useEffect(() => {
    const fetchBookmarkedCount = async () => {
      try {
        const bookmarkedBids = await totalBookmarkedBids();
        setBookmarkedCount(bookmarkedBids.length);
        
        const isCurrentBidBookmarked = bookmarkedBids.some(bookmark => 
          bookmark.bid.id === parseInt(id)
        );
        setIsBookmarked(isCurrentBidBookmarked);
        
        console.log("Current bid bookmarked:", isCurrentBidBookmarked);
        console.log("Bookmark data structure:", bookmarkedBids[0]);
        
      } catch (error) {
        console.error("Error fetching bookmarked count:", error);
      }
    };

    if (id && planInfo) {
      fetchBookmarkedCount();
    }
  }, [id, planInfo]);

  // ✅ FIXED: Remove bookmark silently, show popup only for API limit errors
  const handleUnbookmark = async () => {
    if (!id || !isBookmarked) return;

    setIsBookmarking(true);
    try {
      const bookmarkedBids = await totalBookmarkedBids();
      const currentBookmark = bookmarkedBids.find(bookmark => 
        bookmark.bid.id === parseInt(id)
      );
      
      if (currentBookmark && currentBookmark.id) {
        await deleteBookmarkedBid(currentBookmark.id);
        
        // ✅ Silent update - no popup
        setIsBookmarked(false);
        setBookmarkedCount(prev => prev - 1);
      }
    } catch (err) {
      console.error("Unbookmark error:", err);

      // ✅ Show SavedSearchPopup ONLY for API limit errors (403)
      if (err.response?.status === 403 && 
          err.response?.data?.detail?.includes("save up to")) {
        
        // Extract limit number from error message
        const match = err.response.data.detail.match(/save up to (\d+) bookmarks/);
        const limit = match ? match[1] : '20';
        
        showLimitRestriction(
          "Bookmark Limit Reached",
          `You can only save up to ${limit} bookmarks with your current plan. Upgrade to save More bookmarks.`
        );
        return;
      }

      // ✅ Other errors - handle silently
      if (err.response?.status === 400 || err.response?.status === 409) {
        setIsBookmarked(true); // Revert state silently
      }
    } finally {
      setIsBookmarking(false);
    }
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

  // Similar bids fetch useEffect
  useEffect(() => {
    const fetchSimilarBids = async () => {
      if (!id) return;

      setSimilarBidsLoading(true);
      setSimilarBidsError(null);

      try {
        const data = await similarBids(id);
        console.log(data, "🔥 Similar bids fetched");
        setSimilarBidsData(data);
        console.log("🔥 Similar bids loaded:", data);
      } catch (err) {
        console.error("❌ Failed to fetch similar bids:", err);
        setSimilarBidsError("Failed to load similar bids");
        setSimilarBidsData([]);
      } finally {
        setSimilarBidsLoading(false);
      }
    };

    if (bid && id) {
      fetchSimilarBids();
    }
  }, [id, bid]);

  const bidData = bid || fallback;
  console.log("Bid Data:", bidData);
  console.log(similarBidsData, "Similar Bids Data");  

  // ✅ Show SavedSearchPopup for bookmark limits
  const showLimitRestriction = (title, message) => {
    setLimitPopupData({
      title,
      message,
      upgradeButtonText: "Upgrade Plan",
      cancelButtonText: "Cancel"
    });
    setShowLimitPopup(true);
  };

  // ✅ FIXED: Add bookmark silently, show popup only for API limit errors
  const handleBookmark = async () => {
    if (!id || isBookmarked) return;

    console.log("🔍 Bookmark validation - Plan:", planInfo?.plan_code, "Count:", bookmarkedCount);

    // ✅ Frontend validation - Show SavedSearchPopup for plan limits
    if (planInfo?.plan_code === '002' && bookmarkedCount >= 5) {
      showLimitRestriction(
        "Bookmark Limit Reached",
        "You've reached the maximum of 5 bookmarks. Upgrade to Essentials for unlimited bookmarks."
      );
      return;
    }

    if (planInfo?.plan_code === '001') {
      showLimitRestriction(
        "Bookmark Feature Locked",
        "Upgrade your plan to bookmark bids and save them for later reference."
      );
      return;
    }

    setIsBookmarking(true);
    try {
      const response = await BookMarkedBids(id);
      console.log("✅ Bid bookmarked successfully:", response);
      
      // ✅ Silent update - no popup
      setIsBookmarked(true);
      setBookmarkedCount(prev => prev + 1);

    } catch (err) {
      console.error("Bookmark error:", err);
      
      // ✅ Show SavedSearchPopup ONLY for API limit errors (403)
      if (err.response?.status === 403 && 
          err.response?.data?.detail?.includes("save up to")) {
        
        // Extract limit number from error message
        const match = err.response.data.detail.match(/save up to (\d+) bookmarks/);
        const limit = match ? match[1] : '20';
        
        showLimitRestriction(
          "Bookmark Limit Reached",
          `You can only save up to ${limit} bookmarks with your current plan. Upgrade to save more bookmarks.`
        );
        return;
      }
      
      // ✅ Other errors - handle silently
      if (err.response?.status === 400 || err.response?.status === 409) {
        setIsBookmarked(true); // Already bookmarked
        setBookmarkedCount(prev => prev + 1);
      }
      
      // ✅ All other errors handled silently - no notifications
    } finally {
      setIsBookmarking(false);
    }
  };

  // ✅ Close SavedSearchPopup
  const handleCloseLimitPopup = () => {
    setShowLimitPopup(false);
  };

  // Determine location based on entity_type
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
              location={getLocation()}
              postedDate={
                bidData.open_date
                  ? new Date(bidData.open_date).toLocaleDateString()
                  : fallback.open_date
              }
              deadline={bidData.closing_date || fallback.closing_date}
              sourceLink={bidData.source || fallback.source}
              onBookmark={handleBookmark}
              onUnbookmark={handleUnbookmark}
              isBookmarking={isBookmarking}
              isBookmarked={isBookmarked} 
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

              <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
                <SimilarBids
                  bidData={bidData}
                  similarBids={similarBidsData.slice(0, 2)}
                  loading={similarBidsLoading}
                  error={similarBidsError}
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
              <AiFeature bidData={bidData} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ SavedSearchPopup for API limit errors only */}
      <SavedSearchPopup
        isOpen={showLimitPopup}
        onClose={handleCloseLimitPopup}
        title={limitPopupData.title}
        message={limitPopupData.message}
        upgradeButtonText={limitPopupData.upgradeButtonText}
        cancelButtonText={limitPopupData.cancelButtonText}
      />

    </div>
  );
}

export default SummaryPage;