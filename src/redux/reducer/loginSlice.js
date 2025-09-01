import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.access;
    },
    clearLoginData: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setLoginData, clearLoginData } = loginSlice.actions;
export default loginSlice.reducer;