// src/store/store.js - UPDATED
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import { combineReducers } from "redux";

// Slices
import onboardingReducer from "./reducer/onboardingSlice";
import loginReducer from "./reducer/loginSlice";
import savedSearchesReducer from "./reducer/savedSearchesSlice";
import bidReducer from "./reducer/bidSlice";
import profileReducer from "./reducer/profileSlice";
import authReducer from "./reducer/authSlice";
// import followReducer from "./reducer/followSlice"; // 🔥 NEW FOLLOW SLICE

// Combine all reducers
const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  auth: authReducer,
  login: loginReducer,
  savedSearches: savedSearchesReducer,
  bids: bidReducer,
  profile: profileReducer,
  // follow: followReducer, // 🔥 ADD FOLLOW REDUCER
});

// Redux Persist config
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["bids"], // Don't persist bids data
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure and export store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths for serializable check (because of Map and Set)
        ignoredPaths: ['follow.followedBidIds', 'follow.followMap'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;