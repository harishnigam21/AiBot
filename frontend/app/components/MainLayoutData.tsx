"use client";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/store";
import { setLoginStatus, setUser, User } from "../redux/slices/User";
import { RecentChat, setPinChat, setRecentChat } from "../redux/slices/Chat";
import { loginSwitch } from "../redux/slices/Popup";
export default function MainLayoutData({
  dataUser,
  dataList,
}: {
  dataUser: User | null;
  dataList: {
    recent: RecentChat[];
    pinned: RecentChat[];
  } | null;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!dataUser) {
      dispatch(loginSwitch(true));
      dispatch(setLoginStatus("unauthenticated"));
    } else {
      dispatch(setUser(dataUser));
      dispatch(setLoginStatus("authenticated"));
    }
    if (dataList) {
      dispatch(setRecentChat(dataList.recent));
      dispatch(setPinChat(dataList.pinned));
    }
  }, []);
  return null;
}
