import { useState, useEffect, useCallback } from 'react';
import { totalFollowedBids, followBids, deleteFollowedBid } from '../services/bid.service';

export const useFollowBids = (validateFeatureUsage, showFeatureRestriction) => {
  const [followedBidsData, setFollowedBidsData] = useState([]);
  const [followedBids, setFollowedBids] = useState(new Set());
  const [followLoading, setFollowLoading] = useState(new Set());
  const [followedCount, setFollowedCount] = useState(0);

  const fetchFollowedBids = useCallback(async () => {
    try {
      const data = await totalFollowedBids();

      // Transform data but keep IDs separate for Set
      const transformedData = Array.isArray(data)
        ? data.map(item => ({
            ...item.bid,
            follow_id: item.id,
            follow_created_at: item.created_at
          }))
        : [];

      const count = transformedData.length;
      setFollowedCount(count);
      setFollowedBidsData(transformedData);

      // Create Set of bid IDs for tracking follow status
      const followedBidIds = new Set(transformedData.map(bid => bid.id));
      setFollowedBids(followedBidIds);

    } catch (error) {
      console.error("Error fetching followed bids:", error);
      setFollowedCount(0);
      setFollowedBids(new Set());
      setFollowedBidsData([]);
    }
  }, []);

  const handleFollowBid = useCallback(async (bidId, bidsInfo, isFollowView) => {
    if (!validateFeatureUsage('follow', showFeatureRestriction, followedBids.size)) {
      return;
    }

    setFollowLoading(prev => new Set([...prev, bidId]));

    try {
      if (followedBids.has(bidId)) {
        await handleUnfollowBid(bidId);
        return;
      }

      const result = await followBids(bidId);

      setFollowedBids(prev => {
        const newSet = new Set(prev);
        newSet.add(bidId);
        return newSet;
      });

      setFollowedCount(prev => prev + 1);

      if (!isFollowView && bidsInfo?.results) {
        const bidToAdd = bidsInfo.results.find(bid => bid.id === bidId);
        if (bidToAdd) {
          setFollowedBidsData(prev => [
            ...prev,
            {
              ...bidToAdd,
              follow_id: result.id || result.follow_id,
              follow_created_at: new Date().toISOString()
            }
          ]);
        }
      }

    } catch (error) {
      console.error("Follow error:", error);

      const errorDetail = error.response?.data?.detail || "";

      if (errorDetail.includes("already following")) {
        setFollowedBids(prev => {
          const newSet = new Set(prev);
          newSet.add(bidId);
          return newSet;
        });
      } else if (error.response?.status === 403) {
        showFeatureRestriction(
          error.response.data.title || "Follow Failed",
          error.response.data.message || "Upgrade your plan to follow more bids.",
          "Follow Feature",
          true
        );
      }
    } finally {
      setFollowLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(bidId);
        return newSet;
      });
    }
  }, [followedBids, validateFeatureUsage, showFeatureRestriction]);

  const handleUnfollowBid = useCallback(async (bidId) => {
    setFollowLoading(prev => new Set([...prev, bidId]));

    try {
      const followedBid = followedBidsData.find(bid => bid.id === bidId);

      if (!followedBid || !followedBid.follow_id) {
        console.error("Follow ID not found for bid:", bidId);
        await fetchFollowedBids();
        throw new Error("Follow ID not found");
      }

      const followId = followedBid.follow_id;
      await deleteFollowedBid(followId);

      setFollowedBids(prev => {
        const newSet = new Set(prev);
        newSet.delete(bidId);
        return newSet;
      });

      setFollowedCount(prev => Math.max(0, prev - 1));
      setFollowedBidsData(prev => prev.filter(bid => bid.id !== bidId));

    } catch (error) {
      console.error("Unfollow error:", error);
      showFeatureRestriction(
        "Unfollow Failed",
        "Something went wrong while unfollowing this bid. Please try again.",
        "Follow Feature",
        false
      );
    } finally {
      setFollowLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(bidId);
        return newSet;
      });
    }
  }, [followedBidsData, fetchFollowedBids, showFeatureRestriction]);



  const refreshFollowedData = useCallback(async () => {
  await fetchFollowedBids();
}, [fetchFollowedBids]);
  

  useEffect(() => {
    fetchFollowedBids();
  }, [fetchFollowedBids]);

  return {
    followedBidsData,
    followedBids,
    followLoading,
    followedCount,
    handleFollowBid,
    handleUnfollowBid,
    refetchFollowedBids: fetchFollowedBids,
    refreshFollowedData
  };
};