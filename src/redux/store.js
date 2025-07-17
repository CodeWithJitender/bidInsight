import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./onboardingSlice"; // 👈 import karo

const store = configureStore({
  reducer: {
    onboarding: onboardingReducer, // 👈 add this line
  },
});

export default store;
