import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.connected = true;
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, updateUser } = userSlice.actions;

export default userSlice.reducer;
