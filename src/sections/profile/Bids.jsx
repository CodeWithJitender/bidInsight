import React, { useState, useEffect } from 'react';
import BookmarkTable from './BookmarkTable';
import { 
  totalBookmarkedBids, 
  deleteBookmarkedBid,
  totalFollowedBids,
  deleteFollowedBid 
} from '../../services/bid.service';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Bids() {
  const navigate = useNavigate();
  const [bookmarkedData, setBookmarkedData] = useState([]);
  const [followedData, setFollowedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get profile from Redux to check plan
  const profile = useSelector((state) => state.profile.profile);
  const planCode = profile?.subscription_plan?.plan_code;
  const planName = profile?.subscription_plan?.plan_name?.toLowerCase();
  
  // Check if user has access to follow feature
  const hasFollowAccess = planCode === '003' || planName === 'essentials';
  const hasBookmarkAccess = planCode === '002' || planCode === '003' || 
                           planName === 'starter' || planName === 'essentials';

  // Feature restriction popup state
  const [showRestrictionPopup, setShowRestrictionPopup] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState('');

  useEffect(() => {
    fetchBidsData();
  }, []);

  const fetchBidsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Always try to fetch bookmarked bids if user has access
      if (hasBookmarkAccess) {
        const bookmarksResponse = await totalBookmarkedBids();
        console.log('Bookmarked bids fetched:', bookmarksResponse);
        
        // Transform API response to match table format
        const transformedBookmarks = transformBidsData(bookmarksResponse, 'bookmark');
        setBookmarkedData(transformedBookmarks);
      }

      // Only fetch followed bids if user has Essentials plan
      if (hasFollowAccess) {
        const followedResponse = await totalFollowedBids();
        console.log('Followed bids fetched:', followedResponse);
        
        // Transform API response to match table format
        const transformedFollowed = transformBidsData(followedResponse, 'follow');
        setFollowedData(transformedFollowed);
      }
    } catch (err) {
      console.error('Error fetching bids:', err);
      setError('Failed to load bids data');
      
      // Check if it's a plan restriction error
      if (err.response?.status === 403) {
        handleFeatureRestriction();
      }
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match the table format
  const transformBidsData = (apiData, type) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.map(item => {
      // Handle both bookmark and follow data structures
      const bid = item.bid;
      
      return {
       id: item.id, // This is the top-level ID (174 in your example)
      bidId: bid.id, // This is the bid ID (27800 in your example) 
      entityType: bid.entity_type || 'N/A',
      bidName: bid.bid_name || 'N/A',
      openDate: formatDate(bid.open_date),
      closedDate: formatDate(bid.closing_date),
      countdown: calculateCountdown(bid.closing_date),
      originalData: item // Keep for reference
      };
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate countdown
  const calculateCountdown = (closingDate) => {
    if (!closingDate) return 'N/A';
    
    try {
      const now = new Date();
      const closing = new Date(closingDate);
      const diffTime = closing - now;
      
      if (diffTime <= 0) return 'Closed';
      
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day';
      if (diffDays < 30) return `${diffDays} days`;
      
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return '1 month';
      return `${diffMonths} months`;
    } catch {
      return 'N/A';
    }
  };

  // Handle bookmark removal
  // Handle bookmark removal - receives bidId, finds the record
const handleBookmarkRemove = async (bidId) => {
  try {
    // Find the bookmark record where bid.id matches bidId
    const bookmarkRecord = bookmarkedData.find(item => item.bidId === bidId);
    
    if (!bookmarkRecord) {
      console.error('Bookmark record not found for bidId:', bidId);
      return false;
    }

    // Use the top-level id for delete API
    await deleteBookmarkedBid(bookmarkRecord.id);
    
    // Update local state using the top-level id
    setBookmarkedData(prev => prev.filter(item => item.id !== bookmarkRecord.id));
    
    console.log('Bookmark removed successfully');
    return true;
  } catch (err) {
    console.error('Error removing bookmark:', err);
    return false;
  }
};

// Handle follow removal - receives bidId, finds the record  
const handleFollowRemove = async (bidId) => {
  try {
    // Find the follow record where bid.id matches bidId
    const followRecord = followedData.find(item => item.bidId === bidId);
    
    if (!followRecord) {
      console.error('Follow record not found for bidId:', bidId);
      return false;
    }

    // Use the top-level id for delete API
    await deleteFollowedBid(followRecord.id);
    
    // Update local state using the top-level id
    setFollowedData(prev => prev.filter(item => item.id !== followRecord.id));
    
    console.log('Follow removed successfully');
    return true;
  } catch (err) {
    console.error('Error removing follow:', err);
    return false;
  }
};

  // Handle feature restriction
  const handleFeatureRestriction = () => {
    setRestrictionMessage('Please upgrade your plan to access this feature.');
    setShowRestrictionPopup(true);
  };

  // Handle upgrade navigation
  const handleUpgrade = () => {
    navigate('/pricing');
  };

  if (loading) {
    return (
      <div className='p-4 xl:p-8'>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 xl:p-8'>
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchBidsData}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show restriction popup for Starter plan users trying to access follow feature
  if (!hasBookmarkAccess) {
    return (
      <div className='p-4 xl:p-8'>
        <div className="text-center py-20">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <i className="fas fa-lock text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Feature Restricted</h3>
            <p className="text-gray-600 mb-6">
              Bookmarked bids feature is available in Starter and Essentials plans.
            </p>
            <button 
              onClick={handleUpgrade}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 xl:p-8'>
      {/* Always show Bookmarked Bids for Starter and Essentials plans */}
      {hasBookmarkAccess && (
        <BookmarkTable 
          type="bookmarked" 
          data={bookmarkedData}
          onRemove={handleBookmarkRemove}
          loading={loading}
        />
      )}
      
      {/* Only show Followed Bids for Essentials plan */}
      {hasFollowAccess ? (
        <div className="mt-8">
          <BookmarkTable 
            type="followed" 
            data={followedData}
            onRemove={handleFollowRemove}
            loading={loading}
          />
        </div>
      ) : (
        hasBookmarkAccess && (
          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <i className="fas fa-lock text-3xl text-gray-400 mb-3"></i>
              <h4 className="text-lg font-semibold mb-2">Followed Bids</h4>
              <p className="text-gray-600 mb-4">
                Upgrade to Essentials plan to follow bids and get notifications.
              </p>
              <button 
                onClick={handleUpgrade}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark text-sm"
              >
                Upgrade to Essentials
              </button>
            </div>
          </div>
        )
      )}

      {/* Feature Restriction Popup */}
      {showRestrictionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-2">Feature Restricted</h3>
            <p className="text-gray-600 mb-4">{restrictionMessage}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowRestrictionPopup(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={handleUpgrade}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bids;