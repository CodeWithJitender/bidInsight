// ===== UPDATED PROFILE SLICE WITH COMPLETION SYSTEM =====
// profileSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile } from "../../services/bid.service";

// ⭐ HELPER FUNCTION - Check which pages are filled from API
const checkPageCompletion = (profileData) => {
  if (!profileData || !profileData.profile) {
    return {
      geographicCoverage: false,
      industryCategories: false,
      helpOurAi: false,
      extraData: false
    };
  }

  const profile = profileData.profile;

  return {
    // Page 1: Check if states array exists and has items
    geographicCoverage: !!(profile.states && profile.states.length > 0),
    
    // Page 2: Check if industry is filled
    industryCategories: !!profile.industry,
    
    // Page 3: Check if ANY insurance boolean is true
    helpOurAi: !!(
      profile.workers_compensation ||
      profile.general_liability_insurance ||
      profile.auto_mobile_liability_insurance ||
      profile.medical_professional_eso_insurance ||
      profile.enviormental_insurance ||
      profile.cyber_security_insurance
    ),
    
    // Page 4: Check if ANY insurance amount exists
    extraData: !!(
      profile.workers_compensation_amount ||
      profile.general_liability_insurance_amount ||
      profile.auto_mobile_liability_insurance_amount ||
      profile.medical_professional_eso_insurance_amount ||
      profile.enviormental_insurance_amount ||
      profile.cyber_security_insurance_amount
    )
  };
};

// ⭐ HELPER FUNCTION - Calculate percentage based on completion
const calculatePercentage = (pages) => {
  let percentage = 40; // Base profile
  
  Object.values(pages).forEach((page) => {
    if (page.completed || page.skipped) {
      percentage += 15;
    }
  });
  
  return percentage;
};

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
    
    // ⭐ NEW: Profile Completion State
    profileCompletion: {
      percentage: 40, // Base profile = 40%
      isComplete: false,
      pages: {
        geographicCoverage: { completed: false, skipped: false },
        industryCategories: { completed: false, skipped: false },
        helpOurAi: { completed: false, skipped: false },
        extraData: { completed: false, skipped: false }
      }
    }
  },
  reducers: {
    // ✅ Existing: Clear profile data
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
    
    // ✅ Existing: Reset loading state
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
    },
    
    // ✅ Existing: Complete profile reset to initial state
    resetProfileToInitial: () => {
      return {
        profile: null,
        loading: false,
        error: null,
        profileCompletion: {
          percentage: 40,
          isComplete: false,
          pages: {
            geographicCoverage: { completed: false, skipped: false },
            industryCategories: { completed: false, skipped: false },
            helpOurAi: { completed: false, skipped: false },
            extraData: { completed: false, skipped: false }
          }
        }
      };
    },

    // ⭐ NEW: Initialize completion from profile data (auto-runs after GET API)
    initializeCompletionFromProfile: (state, action) => {
      // Safety check
      if (!state.profileCompletion) {
        state.profileCompletion = {
          percentage: 40,
          isComplete: false,
          pages: {
            geographicCoverage: { completed: false, skipped: false },
            industryCategories: { completed: false, skipped: false },
            helpOurAi: { completed: false, skipped: false },
            extraData: { completed: false, skipped: false }
          }
        };
      }

      const profileData = action.payload;
      const completionStatus = checkPageCompletion(profileData);

      // Update each page's completion status
      Object.keys(completionStatus).forEach((pageName) => {
        if (state.profileCompletion.pages[pageName]) {
          state.profileCompletion.pages[pageName].completed = completionStatus[pageName];
        }
      });

      // Calculate new percentage
      state.profileCompletion.percentage = calculatePercentage(state.profileCompletion.pages);

      // Check if profile is complete
      state.profileCompletion.isComplete = state.profileCompletion.percentage === 100;
    },

    // ⭐ NEW: Update individual page completion (called on Next/Skip)
    updatePageCompletion: (state, action) => {
      const { pageName, completed, skipped } = action.payload;

      // Safety check
      if (!state.profileCompletion?.pages) {
        return;
      }

      if (state.profileCompletion.pages[pageName]) {
        state.profileCompletion.pages[pageName].completed = completed;
        state.profileCompletion.pages[pageName].skipped = skipped;

        // Recalculate percentage
        state.profileCompletion.percentage = calculatePercentage(state.profileCompletion.pages);

        // Check if profile is complete
        state.profileCompletion.isComplete = state.profileCompletion.percentage === 100;
      }
    },

    // ⭐ NEW: Special handler for Page 3 skip (auto-skips Page 4)
    skipHelpOurAi: (state) => {
      // Safety check
      if (!state.profileCompletion?.pages) {
        return;
      }

      // Mark Page 3 as skipped
      state.profileCompletion.pages.helpOurAi.skipped = true;
      state.profileCompletion.pages.helpOurAi.completed = false;

      // Auto-skip Page 4 (dependency)
      state.profileCompletion.pages.extraData.skipped = true;
      state.profileCompletion.pages.extraData.completed = false;

      // Set to 100% (all pages done)
      state.profileCompletion.percentage = 100;
      state.profileCompletion.isComplete = true;
    },

    // ⭐ NEW: Reset completion status only (keep profile data)
    resetCompletionStatus: (state) => {
      state.profileCompletion = {
        percentage: 40,
        isComplete: false,
        pages: {
          geographicCoverage: { completed: false, skipped: false },
          industryCategories: { completed: false, skipped: false },
          helpOurAi: { completed: false, skipped: false },
          extraData: { completed: false, skipped: false }
        }
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
        
        // ⭐ AUTO-INITIALIZE COMPLETION AFTER PROFILE LOADS
        // This automatically checks which pages are filled
        const completionStatus = checkPageCompletion(action.payload);
        
        Object.keys(completionStatus).forEach((pageName) => {
          if (state.profileCompletion.pages[pageName]) {
            state.profileCompletion.pages[pageName].completed = completionStatus[pageName];
          }
        });

        state.profileCompletion.percentage = calculatePercentage(state.profileCompletion.pages);
        state.profileCompletion.isComplete = state.profileCompletion.percentage === 100;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ⭐ EXPORT ACTIONS
export const { 
  clearProfile, 
  resetProfileState, 
  resetProfileToInitial,
  initializeCompletionFromProfile,
  updatePageCompletion,
  skipHelpOurAi,
  resetCompletionStatus
} = profileSlice.actions;

// ⭐ EXPORT SELECTORS (use these in components)
export const selectCompletionPercentage = (state) => 
  state.profile?.profileCompletion?.percentage || 40;

export const selectIsProfileComplete = (state) => 
  state.profile?.profileCompletion?.isComplete || false;

export const selectPageCompletion = (state) => 
  state.profile?.profileCompletion?.pages || {};

export const selectProfileData = (state) => state.profile?.profile || null;

export const selectProfileLoading = (state) => state.profile?.loading || false;

export default profileSlice.reducer;