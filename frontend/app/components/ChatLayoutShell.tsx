"use client";

import { useEffect, useState } from "react";
import { Chat, setSelectChat } from "../redux/slices/Chat";
import { useAppDispatch } from "../redux/store";
import { setChatLoading } from "../redux/slices/LoadingStates";
import { useRouter } from "next/navigation";

export default function ChatLayoutShell({
  dataChat,
}: {
  dataChat: Chat | null;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(setChatLoading(true));
    try {
      if (!dataChat) {
        router.push("/");
      } else {
        dispatch(setSelectChat(dataChat));
      }
    } catch (error) {
    } finally {
      dispatch(setChatLoading(false));
    }
  }, []);
  return null;
}
