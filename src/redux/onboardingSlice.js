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
  skippedInsurance: false, // ✅ NEW FLAG
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    saveGeographicCoverage: (state, action) => {
      state.geographicCoverage = {
        region: action.payload.region || "",
        states: action.payload.states || [],
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

    // ✅ NEW ACTIONS:
    setSkippedInsurance: (state, action) => {
      state.skippedInsurance = action.payload;
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
  clearOnboardingData,
  setSkippedInsurance, // ✅ EXPORT THIS TOO
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
