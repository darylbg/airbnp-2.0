import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  sender: null,
  receiver: null,
};

const chatBotSlice = createSlice({
  name: "chatBot",
  initialState,
  reducers: {
    setChatBotOpen(state, action) {
      state.open = action.payload.open;
      state.sender = action.payload.sender;
      state.receiver = action.payload.receiver;
    },
    setChatBotClose(state) {
      console.log("close chatbot running");
      // Correct way to reset state
      state.open = false;
      state.sender = null;
      state.receiver = null;
    },
  },
});

export const { setChatBotOpen, setChatBotClose } = chatBotSlice.actions;
export default chatBotSlice.reducer;
