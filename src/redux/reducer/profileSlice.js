
// ===== 1. UPDATE PROFILE SLICE =====
// profileSlice.js - Add complete reset actions

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile } from "../../services/bid.service";

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserProfile();
      if (data && typeof data === "object") {
        const { fein_or_ssn_number, ...rest } = data;
        return rest;
      } 
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Clear profile data
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
    // ✅ Reset loading state
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
    },
    // ✅ Complete profile reset to initial state
    resetProfileToInitial: () => {
      return {
        profile: null,
        loading: false,
        error: null,
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, resetProfileState, resetProfileToInitial } = profileSlice.actions;
export default profileSlice.reducer;