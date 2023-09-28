import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletModal: false,
  succesModal: false,
  dealModal: false,
  newUserModal: false,
  succesModalText: "",
  fileModal: false,
  file: "",
};

export const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setWalletModal: (state, action) => {
      state.walletModal = action.payload;
    },
    setDealModal: (state, action) => {
      state.dealModal = action.payload;
    },
    openSuccesModal: (state, action) => {
      state.succesModalText = action.payload.text;
      state.succesModal = true;
    },
    closeSuccesModal: (state, action) => {
      state.succesModal = false;
    },
    setNewUserModal: (state, action) => {
      state.newUserModal = action.payload;
    },
    openFileModal: (state, action) => {
      state.fileModal = true;
      state.file = action.payload;
    },
    closeFileModal: (state, action) => {
      state.fileModal = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setWalletModal,
  setDealModal,
  openSuccesModal,
  closeSuccesModal,
  setNewUserModal,
  openFileModal,
  closeFileModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
