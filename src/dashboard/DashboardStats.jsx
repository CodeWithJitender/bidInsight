import React from 'react';
import BgCover from '../components/BgCover';

const DashboardStats = ({
  bidCount,
  bidsInfo,
  bookmarkedCount,
  followedCount,
  restrictions,
  onNavigate,
  onFollowedCardClick,
  planInfo, // New prop to get subscription plan info
  onFeatureRestriction
}) => {
  // Extract plan limits from profile
  const maxBookmarks = planInfo?.subscription_plan?.max_bookmark || 0;
  const maxFollows = planInfo?.subscription_plan?.max_follow || 0;

  const planCode = planInfo?.subscription_plan?.plan_code || planInfo?.plan_code;
  const isRestrictedBookmarkPlan = planCode === "001";
  
  // Function to format count display based on restrictions and limits
  const formatCountDisplay = (currentCount, maxLimit, isRestricted) => {
    if (isRestricted || maxLimit === 0) {
      return currentCount; // Just show current count for restricted plans
    }
    return `${currentCount}/${maxLimit}`; // Show current/max for allowed plans
  };

  const handleBookmarkCardClick = () => {
    if (isRestrictedBookmarkPlan || restrictions?.bookmark) {
      onFeatureRestriction(
        "Bookmark Feature Locked",
        "Upgrade your plan to bookmark bids and save them for later reference.",
        "Bookmark Feature",
        true
      );
      return;
    }
    // If not restricted, navigate to bookmark page
    onNavigate("/dashboard/bookmarkBids");
  };

  const handleNewBidsClickNew = () => {
  if (planCode === "001") {
    onFeatureRestriction(
      "New Bids Feature Locked",
      "Upgrade your plan to view new bids posted in the last 24 hours.",
      "New Bids Feature",
      true
    );
    return;
  }
  onNavigate("/dashboard?bid_type=Active&page=1&new_bids=true&pageSize=25&ordering=closing_date");
};


  // New handler for New Bids click
  const handleNewBidsClick = () => {
    onNavigate("/dashboard?bid_type=Active&page=1&new_bids=true&pageSize=25&ordering=closing_date");
  };

  const stats = [
    {
      id: 1,
      title: "Total Bids",
      num: bidCount?.count || 0,
      tag: "FILTER",
      description: "Narrow down bids by industry, status, location and more.",
      onClick: () => onNavigate("/dashboard?page=1&pageSize=25&bid_type=Active&ordering=closing_date")
    },
    {
      id: 2,
      title: "Active Bids",
      num: bidsInfo?.count || 0,
      tag: "ACTIVE BIDS",
      description: "Bids that haven't been closed/awarded yet!"
    },
    {
      id: 3,
      title: "New Bids",
      num: bidCount?.new_bids || 0,
      tag: "NEW BIDS",
      description: "Bids added in the last 24 hours.",
      onClick: handleNewBidsClickNew // Add click handler for New Bids
    },
    {
      id: 4,
      title: "Bookmark",
      num: formatCountDisplay(bookmarkedCount, maxBookmarks, restrictions?.bookmark),
      tag: "SAVE",
      description: restrictions?.bookmark 
        ? "Upgrade to bookmark bids and save them for later"
        : "Bookmark bids you're interested in so you can check them out later.",
      onClick: handleBookmarkCardClick
    },
    {
      id: 5,
      title: "Followed",
      num: formatCountDisplay(followedCount, maxFollows, restrictions?.follow),
      tag: "FOLLOW",
      description: restrictions?.follow
        ? "Upgrade to follow bids and get instant updates"
        : "Get instant updates on changes & deadlines for these bids.",
      onClick: onFollowedCardClick
    }
  ];

  return (
    <div className="flex gap-3 text-[1em]">
      {stats.map((item) => (
        <BgCover
          key={item.id}
          description={item.description}
          title={item.title}
          onClick={item.onClick || (() => {})}
        >
          <div className="flex gap-2">
            <div className="text font-inter text-[#DBDBDB]">
              {item.title}
            </div>
            <p className="num font-inter font-semibold text-white">
              {item.num}
            </p>
          </div>
        </BgCover>
      ))}
    </div>
  );
};

export default DashboardStats;