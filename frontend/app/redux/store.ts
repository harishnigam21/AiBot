import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import UserSlice from "./slices/User";
import PopupSlice from "./slices/Popup";
import chatSlice from "./slices/Chat";
import LayoutSlice from "./slices/Layout";
import LoadingState from "./slices/LoadingStates";

enableMapSet();
const store = configureStore({
  reducer: {
    user: UserSlice,
    popup: PopupSlice,
    chat: chatSlice,
    layout: LayoutSlice,
    loadings: LoadingState,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
