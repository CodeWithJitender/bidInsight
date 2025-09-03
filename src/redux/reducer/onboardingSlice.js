import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  geographicCoverage: {
    region: "",
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
    region: action.payload.region || "",
    // Extract only IDs if objects are passed
    states: action.payload.states?.map(stateItem => 
      typeof stateItem === 'object' && stateItem.value ? stateItem.value : stateItem
    ) || [],
  };
},
    saveIndustryCategory: (state, action) => {
      // Expects array of selected industries from MultiSelect
      state.industryCategory = action.payload || [];
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
