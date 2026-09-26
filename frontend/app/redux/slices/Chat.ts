import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface Message {
  _id: string;
  chatId: string;
  role: "ai" | "human";
  content: string;
  images: string[];
}
export interface Chat {
  _id: string;
  title: string;
  pinned: boolean;
  messages: Message[];
}
export interface RecentChat {
  _id: string;
  title: string;
  pinned: boolean;
}
interface ChatState {
  selectedChat: Chat | null;
  recentChatsList: RecentChat[];
}
const initialState: ChatState = {
  selectedChat: null,
  recentChatsList: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startNewChat: (state) => {
      state.selectedChat = null;
    },
    setSelectChat: (state, action: PayloadAction<Chat>) => {
      state.selectedChat = action.payload;
    },
    setRecentChat: (state, action: PayloadAction<RecentChat[]>) => {
      state.recentChatsList = action.payload;
    },
    addRecentChat: (state, action: PayloadAction<RecentChat>) => {
      state.recentChatsList.unshift(action.payload);
    },
    addMessage: (state, action: PayloadAction<Message[]>) => {
      const response = action.payload;
      if (state.selectedChat) {
        response.forEach((item) => {
          state.selectedChat?.messages.push(item);
        });
      }
    },
    removeDummies: (state) => {
      if (state.selectedChat) {
        state.selectedChat.messages = state.selectedChat.messages.filter(
          (msg) => msg._id !== "dummy",
        );
      }
    },
  },
});
export const {
  startNewChat,
  setSelectChat,
  setRecentChat,
  addRecentChat,
  addMessage,
  removeDummies,
} = chatSlice.actions;
export default chatSlice.reducer;
