"use client";
import Loader from "@/app/components/Loader";
import MessageArea from "@/app/components/MessageArea";
import { useAppSelector } from "@/app/redux/store";
export default function Chat() {
  const { selectedChat } = useAppSelector((store) => store.chat);
  const chatLoading = useAppSelector((store) => store.loadings.chatLoading);

  return (
    <div className="p-2 grow w-full overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-borderhl flex flex-col gap-3">
      {chatLoading ? (
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
      )}
    </div>
  );
}
