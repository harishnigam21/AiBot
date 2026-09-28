"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/store";
import Loader from "./Loader";
import MessageArea from "./MessageArea";
export default function ChatShell() {
  const chatLoading = useAppSelector((store) => store.loadings.chatLoading);
  const { selectedChat } = useAppSelector((store) => store.chat);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return;
  return chatLoading ? (
    <div className="w-full flex justify-center">
      <Loader size={10} />
    </div>
  ) : selectedChat ? (
    <div className="w-full lg:w-3/4 self-center flex flex-col gap-3">
      <MessageArea />
    </div>
  ) : (
    <p className="font-thin text-red-500 text-sm tracking-wide">
      Failed to fetch messages !
    </p>
  );
}
