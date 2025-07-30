// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import { combineReducers } from "redux";

// Slices
import onboardingReducer from "./reducer/onboardingSlice";
import loginReducer from "./reducer/loginSlice";
import savedSearchesReducer from "./reducer/savedSearchesSlice";
import bidReducer from "./reducer/bidSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import { combineReducers } from "redux";

// Combine all reducers
const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  login: loginReducer,
  savedSearches: savedSearchesReducer,
  bids: bidReducer,
  profile: profileReducer, // ✅ Added profile reducer
});

// Redux Persist config
const persistConfig = {
  key: "root",
  storage,
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure and export store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // suppress persist warnings
    }),
});

export const persistor = persistStore(store);
export default store;
