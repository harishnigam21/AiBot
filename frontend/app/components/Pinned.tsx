import { ChevronRight, PinOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useEffect, useState } from "react";
import { RecentChat, setUnpinChat } from "../redux/slices/Chat";
import { setRecentChatLoading } from "../redux/slices/LoadingStates";
import useApi from "@/hooks/useApi";
import { Data } from "@/types/data";
import toast from "react-hot-toast";
import TitleList from "./TitleList";

export default function Pinned() {
  const { sendRequest } = useApi();
  const { selectedChat, pinChatsList } = useAppSelector((store) => store.chat);
  const { recentChatLoading } = useAppSelector((store) => store.loadings);
  const dispatch = useAppDispatch();
  const [ShowPin, setShowPin] = useState<boolean>(false);
  const handleUnPin = async (id: string) => {
    try {
      dispatch(setRecentChatLoading(true));
      await sendRequest(`api/chat/unpin/${id}`).then((result) => {
        const data = result.data as Data<RecentChat> | undefined;
        if (result && result.success) {
          if (data && data.data) {
            dispatch(setUnpinChat(data.data));
          }
        } else {
          throw new Error("Failed to unpin chat");
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      dispatch(setRecentChatLoading(false));
    }
  };
  useEffect(() => {
    const ids = pinChatsList.map((item) => item._id);
    if (selectedChat && ids.includes(selectedChat._id)) {
      setShowPin(true);
    } else {
      setShowPin(false);
    }
  }, [selectedChat, pinChatsList]);
  return (
    pinChatsList &&
    pinChatsList.length > 0 && (
      <div className="flex flex-col p-3 overflow-y-auto">
        {/* heading */}
        <div className="flex relative flex-nowrap gap-1 items-center justify-between text-txsec cursor-pointer mb-1 group transition-all">
          <div
            className="flex flex-nowrap gap-1 items-center"
            onClick={() => setShowPin((prev) => !prev)}
          >
            <p className="font-medium text-sm">Pinned</p>
            {ShowPin ? (
              <ChevronRight size={12} className="mt-1 rotate-90" />
            ) : (
              <ChevronRight size={12} className="mt-1" />
            )}
          </div>
        </div>
        {pinChatsList && pinChatsList.length > 0 ? (
          ShowPin ? (
            <div className="flex flex-col gap-1">
              {pinChatsList.map((item, i) => (
                <TitleList
                  Pname="Unpin"
                  item={item}
                  selectedChat={selectedChat}
                  key={`pinned/chat/list/${i}`}
                  Picon={PinOff}
                  PClick={handleUnPin}
                />
              ))}
            </div>
          ) : (
            <></>
          )
        ) : (
          <p
            className={`font-thin text-red-500 text-xs tracking-wider ${recentChatLoading && "hidden"}`}
          >
            No pinned Chat !
          </p>
        )}
      </div>
    )
  );
}
