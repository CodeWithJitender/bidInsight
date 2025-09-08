import { useState, useEffect } from 'react';
import { totalBookmarkedBids } from '../services/bid.service';

export const useBookmarks = () => {
  const [bookmarkedCount, setBookmarkedCount] = useState(0);
  const [bookmarkedBids, setBookmarkedBids] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const fetchBookmarkedBids = async () => {
    try {
      setBookmarkLoading(true);
      const data = await totalBookmarkedBids();
      
      // Transform data - extract 'bid' object from each item
      const transformedData = Array.isArray(data)
        ? data.map(item => {
            const bidData = item.bid || item;
            return {
              ...bidData,
              bookmark_id: item.id,
              bookmark_created_at: item.created_at
            };
          })
        : [];

      const count = transformedData.length;
      setBookmarkedCount(count);
      setBookmarkedBids(transformedData);

    } catch (error) {
      console.error("Error fetching bookmarked bids:", error);
      setBookmarkedCount(0);
      setBookmarkedBids([]);
    } finally {
      setBookmarkLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedBids();
  }, []);

  return {
    bookmarkedCount,
    bookmarkedBids,
    bookmarkLoading,
    refetchBookmarks: fetchBookmarkedBids
  };
};