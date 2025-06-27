import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    saveRegisterData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { saveRegisterData } = registerSlice.actions;
export default registerSlice.reducer;