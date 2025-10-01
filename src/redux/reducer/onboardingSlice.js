import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  geographicCoverage: {
    nation_wide: false,    // ⭐ ADD THIS
    region: [],            // ⭐ CHANGE to array
    states: [],
  },
  industryCategory: [], // changed from string to array
  insuranceData: {
    workersCompensation: "",
    generalLiability: "",
    autoLiability: "",
    medicalProfessional: "",
    cyberInsurance: "",
    environmentalInsurance: "",
  },
  insuranceAmounts: {
    generalLiabilityAmount: "",
    autoLiabilityAmount: "",
    medicalProfessionalAmount: "",
    environmentalAmount: "",
    cybersecurityAmount: "",
  },
  skippedInsurance: false, // ✅ Skip flag
  allNoInsurance: false,   // ✅ All "No" flag - NEW
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    saveGeographicCoverage: (state, action) => {
  state.geographicCoverage = {
    nation_wide: Boolean(action.payload.nation_wide),
    region: Array.isArray(action.payload.region) 
      ? action.payload.region 
      : (action.payload.region ? [action.payload.region] : []),
    states: Array.isArray(action.payload.states)
      ? action.payload.states.map(stateItem => 
          typeof stateItem === 'object' && stateItem.value ? stateItem.value : stateItem
        )
      : [],
  };
  console.log("✅ Redux saved:", state.geographicCoverage);
},

    saveIndustryCategory: (state, action) => {
      // Handle null/undefined for skip
      if (!action.payload) {
        state.industryCategory = []; // Clear on skip
      } else if (Array.isArray(action.payload)) {
        state.industryCategory = action.payload; // Array of IDs
      } else {
        state.industryCategory = [action.payload]; // Single ID -> convert to array
      }
    },
    saveInsuranceData: (state, action) => {
      state.insuranceData = { ...action.payload };
    },
    saveInsuranceAmounts: (state, action) => {
      state.insuranceAmounts = { ...action.payload };
    },

    // ✅ SKIP & ALL NO ACTIONS:
    setSkippedInsurance: (state, action) => {
      state.skippedInsurance = action.payload;
    },
    setAllNoInsurance: (state, action) => {
      state.allNoInsurance = action.payload;
    },

    clearInsuranceData: (state) => {
      state.insuranceData = {
        workersCompensation: "",
        generalLiability: "",
        autoLiability: "",
        medicalProfessional: "",
        cyberInsurance: "",
        environmentalInsurance: "",
      };
      console.log(state.insuranceData);
    },
    clearInsuranceAmounts: (state) => {
      state.insuranceAmounts = { ...initialState.insuranceAmounts };
    },

    clearOnboardingData: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  saveGeographicCoverage,
  saveIndustryCategory,
  saveInsuranceData,
  saveInsuranceAmounts,
  clearInsuranceData,
  clearInsuranceAmounts,
  clearOnboardingData,
  setSkippedInsurance,   // ✅ EXPORT
  setAllNoInsurance,     // ✅ EXPORT - NEW ACTION
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
