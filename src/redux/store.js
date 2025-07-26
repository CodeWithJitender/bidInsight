// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./reducer/onboardingSlice";
import loginReducer from "./reducer/loginSlice";
import savedSearchesReducer from "./reducer/savedSearchesSlice";
import bidReducer from "./reducer/bidSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import { combineReducers } from "redux";

// combine reducers
const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  login: loginReducer,
  savedSearches: savedSearchesReducer,
  bids: bidReducer,
});

// config for redux persist
const persistConfig = {
  key: "root",
  storage,
};

// persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist throws warning otherwise
    }),
});

export const persistor = persistStore(store);
export default store;