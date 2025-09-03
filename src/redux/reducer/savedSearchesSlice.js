import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedSearches: [],
  savedSearchesCount: 0,
};

const savedSearchesSlice = createSlice({
  name: "savedSearches",
  initialState,
  reducers: {
    addSavedSearch: (state, action) => {
      console.log(action.payload);
      state.savedSearches = action.payload;
      state.savedSearchesCount = action.payload.length;
    },
    removeSavedSearch: (state, action) => {
      state.savedSearches = [];
      state.savedSearchesCount = 0;
    },
  },
});

export const { addSavedSearch, removeSavedSearch } = savedSearchesSlice.actions;
export default savedSearchesSlice.reducer;
