"use client";
import { useAppSelector } from "../redux/store";
import { useEffect, useRef } from "react";
import Loader from "./Loader";
import Message from "./Message";
export default function MessageArea() {
  const { selectedChat } = useAppSelector((store) => store.chat);
  const messageLoading = useAppSelector(
    (store) => store.loadings.messageLoading,
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedChat?.messages]);
  return (
    <>
      {selectedChat &&
        selectedChat.messages &&
        selectedChat.messages.map((msg) => (
          <Message
            msg={msg}
            selectedChat={selectedChat}
            key={`chat/selected/message/${msg._id}`}
          />
        ))}
      {messageLoading && (
        <div className="w-full flex px-2">
          <Loader size={4} density={2} speed={5} />
        </div>
      )}
      <div ref={scrollRef} className="w-full"></div>
    </>
  );
}
