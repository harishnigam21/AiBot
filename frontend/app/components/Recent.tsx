import { ChevronRight } from "lucide-react";
import Loader from "./Loader";
import { useAppSelector } from "../redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Recent() {
  const { selectedChat, recentChatsList } = useAppSelector(
    (store) => store.chat,
  );
  const { recentChatLoading } = useAppSelector((store) => store.loadings);
  const router = useRouter();
  const [showRecent, setShowRecent] = useState<boolean>(false);
  useEffect(() => {
    if (selectedChat) {
      setShowRecent(true);
    }
  });
  return (
    <div className="flex flex-col p-3 overflow-y-auto">
      {/* heading */}
      <div
        className="flex flex-nowrap gap-1 items-center text-txsec cursor-pointer mb-2"
        onClick={() => setShowRecent((prev) => !prev)}
      >
        <p className="font-medium text-sm">Recents</p>
        {showRecent ? (
          <ChevronRight size={12} className="mt-1 rotate-90" />
        ) : (
          <ChevronRight size={12} className="mt-1" />
        )}
        {recentChatLoading && <Loader size={4} density={2} color="txsec" />}
      </div>
      {recentChatsList && recentChatsList.length > 0 ? (
        showRecent ? (
          <div className="flex flex-col gap-1">
            {recentChatsList.map((item, i) => (
              <div
                onClick={() => {
                  router.push(`/c=${item._id}`);
                }}
                key={`recent/chat/list/${i}`}
                className={`flex rounded-lg items-center ${selectedChat?._id == item._id && "bg-bgsec/90"} p-2 cursor-pointer hover:bg-bgsec/90 active:bg-bgsec/90`}
              >
                <p className="font-thin text-sm break-all line-clamp-1">
                  {item.title}
                </p>
              </div>
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
