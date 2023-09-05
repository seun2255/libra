import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user";
import modalsReducer from "./modals";

export const store = configureStore({
  reducer: {
    user: userReducer,
    modals: modalsReducer,
  },
});
