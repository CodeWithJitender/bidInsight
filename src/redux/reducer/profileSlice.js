// profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile } from "../../services/bid.service";

// Async thunk to fetch profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserProfile();
      // console.log("Raw API Data:", data);

      // ✅ Remove fein_or_ssn_number no matter where it is
      if (data && typeof data === "object") {
        const { fein_or_ssn_number, ...rest } = data;
        // console.log(data);
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
    // ✅ Add action to clear profile data
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
    // ✅ Add action to reset loading state
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
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

// Export actions
export const { clearProfile, resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;