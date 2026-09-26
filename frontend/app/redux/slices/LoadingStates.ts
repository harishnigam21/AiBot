import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState: {
  messageLoading: boolean;
  chatLoading: boolean;
  recentChatLoading: boolean;
} = {
  messageLoading: false,
  chatLoading: false,
  recentChatLoading: false,
};
const LoadingState = createSlice({
  name: "loadings",
  initialState,
  reducers: {
    setMessageLoading: (state, action: PayloadAction<boolean>) => {
      state.messageLoading = action.payload;
    },
    setChatLoading: (state, action: PayloadAction<boolean>) => {
      state.chatLoading = action.payload;
    },
    setRecentChatLoading: (state, action: PayloadAction<boolean>) => {
      state.recentChatLoading = action.payload;
    },
  },
});

export const { setMessageLoading, setChatLoading, setRecentChatLoading } =
  LoadingState.actions;
export default LoadingState.reducer;
