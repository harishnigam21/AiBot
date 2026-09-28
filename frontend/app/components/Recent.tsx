import { ChevronRight, Ellipsis, PenSquare, Pin } from "lucide-react";
import Loader from "./Loader";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addPinChat, RecentChat, startNewChat } from "../redux/slices/Chat";
import TitleList from "./TitleList";
import { setRecentChatLoading } from "../redux/slices/LoadingStates";
import { Data } from "@/types/data";
import useApi from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function Recent() {
  const { selectedChat, recentChatsList } = useAppSelector(
    (store) => store.chat,
  );
  const { recentChatLoading } = useAppSelector((store) => store.loadings);
  const { sendRequest } = useApi();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showRecent, setShowRecent] = useState<boolean>(false);
  const handlePin = async (id: string) => {
    try {
      dispatch(setRecentChatLoading(true));
      await sendRequest(`api/chat/pin/${id}`).then((result) => {
        const data = result.data as Data<RecentChat> | undefined;
        if (result && result.success) {
          if (data && data.data) {
            dispatch(addPinChat(data.data));
          }
        } else {
          throw new Error("Failed to pin chat");
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
    const ids = recentChatsList.map((item) => item._id);
    if (selectedChat && ids.includes(selectedChat._id)) {
      setShowRecent(true);
    } else {
      setShowRecent(false);
    }
  }, [selectedChat, recentChatsList]);
  return (
    <div className="flex flex-col p-3 overflow-y-auto">
      {/* heading */}
      <div className="flex relative flex-nowrap gap-1 items-center justify-between text-txsec cursor-pointer mb-1 group transition-all">
        <div
          className="flex flex-nowrap gap-1 items-center"
          onClick={() => setShowRecent((prev) => !prev)}
        >
          <p className="font-medium text-sm">Recents</p>
          {showRecent ? (
            <ChevronRight size={12} className="mt-1 rotate-90" />
          ) : (
            <ChevronRight size={12} className="mt-1" />
          )}
        </div>
        {recentChatLoading && <Loader size={4} density={2} color="txsec" />}
        <div className="hidden text-txsec flex-nowrap gap-4 items-center self-center mt-1 group-hover:flex group-active:flex">
          <PenSquare
            size={14}
            onClick={() => {
              dispatch(startNewChat());
              router.push("/");
            }}
          />
          <Ellipsis size={14} />
        </div>
      </div>
      {recentChatsList && recentChatsList.length > 0 ? (
        showRecent ? (
          <div className="flex flex-col">
            {recentChatsList.map((item, i) => (
              <TitleList
                item={item}
                selectedChat={selectedChat}
                key={`recent/chat/list/${i}`}
                Picon={Pin}
                PClick={handlePin}
                Pname="Pin"
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
          No recent Chat !
        </p>
      )}
    </div>
  );
}
