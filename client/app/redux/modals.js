import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletModal: false,
  succesModal: false,
  newUserModal: false,
  succesModalText: "",
  videoModal: false,
  video: "",
  imageModal: false,
  image: "",
  documentModal: false,
  document: "",
};

export const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setWalletModal: (state, action) => {
      state.walletModal = action.payload;
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
    openVideoModal: (state, action) => {
      state.videoModal = true;
      state.video = action.payload.video;
    },
    closeVideoModal: (state, action) => {
      state.videoModal = false;
    },
    openImageModal: (state, action) => {
      state.imageModal = true;
      state.image = action.payload.image;
    },
    closeImageModal: (state, action) => {
      state.imageModal = false;
    },
    openDocumentModal: (state, action) => {
      state.documentModal = true;
      state.document = action.payload.document;
    },
    closeDocumentModal: (state, action) => {
      state.documentModal = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setWalletModal,
  openSuccesModal,
  closeSuccesModal,
  setNewUserModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
