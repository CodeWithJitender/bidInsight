import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bidsInfo: {
    count: 0,
    page: 1,
    page_size: 25,
    total_pages: 0,
    results: []
  },
};

const bidSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {
    setBids: (state, action) => {
      state.bidsInfo = action.payload;
    },
    clearBids: (state) => {
      state.bidsInfo = {
        count: 0,
        page: 1,
        page_size: 25,
        total_pages: 0,
        results: []
      };
    }
  },
});

export const { setBids, clearBids } = bidSlice.actions;
export default bidSlice.reducer;