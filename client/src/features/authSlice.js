import { createSlice } from "@reduxjs/toolkit";

const savedToken = localStorage.getItem("token");

const initialState = {
  token: savedToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      // I only store the token
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
