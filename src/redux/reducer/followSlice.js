// src/redux/reducer/followSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followedBids: [], // Array of followed bid objects with follow_id
  followedBidIds: new Set(), // Set of bid_ids for quick lookup
  followMap: new Map(), // Map: bid_id -> follow_id for delete operations
  loading: false,
  error: null,
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    // Add a followed bid
    addFollowedBid: (state, action) => {
      const followData = action.payload; // Response from follow API
      
      // Add to followedBids array
      state.followedBids.push(followData);
      
      // Add bid_id to Set for quick lookup
      state.followedBidIds.add(followData.bid.id);
      
      // Map bid_id to follow_id for delete operations
      state.followMap.set(followData.bid.id, followData.id);
      
      console.log("✅ Added followed bid to Redux:", followData);
    },

    // Remove a followed bid
    removeFollowedBid: (state, action) => {
      const bidId = action.payload; // bid_id to remove
      
      // Remove from followedBids array
      state.followedBids = state.followedBids.filter(
        item => item.bid.id !== bidId
      );
      
      // Remove from Set
      state.followedBidIds.delete(bidId);
      
      // Remove from Map
      state.followMap.delete(bidId);
      
      console.log("✅ Removed followed bid from Redux:", bidId);
    },

    // Set all followed bids (for initial load)
    setFollowedBids: (state, action) => {
      const followedData = action.payload; // Array from totalFollowedBids API
      
      state.followedBids = followedData;
      
      // Create Set of bid_ids
      state.followedBidIds = new Set(
        followedData.map(item => item.bid.id)
      );
      
      // Create Map: bid_id -> follow_id
      state.followMap = new Map(
        followedData.map(item => [item.bid.id, item.id])
      );
      
      console.log("✅ Set all followed bids in Redux:", followedData.length);
    },

    // Get follow_id by bid_id (for delete operations)
    getFollowId: (state, action) => {
      const bidId = action.payload;
      return state.followMap.get(bidId);
    },

    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addFollowedBid,
  removeFollowedBid,
  setFollowedBids,
  getFollowId,
  setLoading,
  setError,
  clearError,
} = followSlice.actions;

export default followSlice.reducer;

// Selectors
export const selectFollowedBids = (state) => state.follow.followedBids;
export const selectFollowedBidIds = (state) => state.follow.followedBidIds;
export const selectFollowMap = (state) => state.follow.followMap;
export const selectIsFollowed = (bidId) => (state) => 
  state.follow.followedBidIds.has(bidId);
export const selectFollowId = (bidId) => (state) => 
  state.follow.followMap.get(bidId);