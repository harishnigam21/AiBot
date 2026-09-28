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
  createdAt: Date;
}
export interface RecentChat {
  _id: string;
  title: string;
  pinned: boolean;
  createdAt: Date;
}
interface ChatState {
  selectedChat: Chat | null;
  recentChatsList: RecentChat[];
  pinChatsList: RecentChat[];
}
const initialState: ChatState = {
  selectedChat: null,
  recentChatsList: [],
  pinChatsList: [],
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
    setPinChat: (state, action: PayloadAction<RecentChat[]>) => {
      state.pinChatsList = action.payload;
    },
    addPinChat: (state, action: PayloadAction<RecentChat>) => {
      state.recentChatsList = state.recentChatsList.filter(
        (item) => item._id !== action.payload._id,
      );
      state.pinChatsList.push(action.payload);
    },
    setUnpinChat: (state, action: PayloadAction<RecentChat>) => {
      const item = action.payload;
      state.pinChatsList = state.pinChatsList.filter(
        (inthere) => inthere._id !== item._id,
      );

      function findInsertIndex(
        chats: RecentChat[],
        newChat: RecentChat,
      ): number {
        const target = new Date(newChat.createdAt).getTime();
        let left = 0;
        let right = chats.length;
        while (left < right) {
          const mid = Math.floor((left + right) / 2);
          const midTime = new Date(chats[mid].createdAt).getTime();
          if (midTime >= target) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }
        return left;
      }

      const index = findInsertIndex(state.recentChatsList, item);
      state.recentChatsList = [
        ...state.recentChatsList.slice(0, index),
        item,
        ...state.recentChatsList.slice(index),
      ];
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
    deleteChat: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedChat?._id == id) {
        state.selectedChat = null;
      }
      state.recentChatsList = state.recentChatsList.filter(
        (item) => item._id !== id,
      );
      state.pinChatsList = state.pinChatsList.filter((item) => item._id !== id);
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
  setPinChat,
  addPinChat,
  setUnpinChat,
  deleteChat,
} = chatSlice.actions;
export default chatSlice.reducer;
