"use client";
import useApi from "@/hooks/useApi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { Data } from "@/types/data";
import { setLoginStatus, setUser, User } from "../redux/slices/User";
import { RecentChat, setRecentChat } from "../redux/slices/Chat";
import { setRecentChatLoading } from "../redux/slices/LoadingStates";
export default function MainLayoutData() {
  const { sendRequest } = useApi();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      await sendRequest("api/auth/user").then((result) => {
        const data = result?.data as Data<User> | undefined;
        if (result && result.success && data?.data) {
          dispatch(setUser(data?.data));
          dispatch(setLoginStatus("authenticated"));
        } else {
          dispatch(setLoginStatus("unauthenticated"));
        }
      });
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const getRecentList = async () => {
      dispatch(setRecentChatLoading(true));
      await sendRequest("api/chat/recent")
        .then((result) => {
          const data = result.data as Data<RecentChat[]> | undefined;
          if (result && result.success) {
            if (data && data.data) {
              dispatch(setRecentChat(data.data));
            }
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          dispatch(setRecentChatLoading(false));
        });
    };
    getRecentList();
  }, []);
  return null;
}
