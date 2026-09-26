"use client";
import { ArrowUp, ChevronDown, Mic, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import useApi from "@/hooks/useApi";
import toast from "react-hot-toast";
import { Data } from "@/types/data";
import {
  addMessage,
  addRecentChat,
  Chat,
  Message,
  removeDummies,
  setSelectChat,
} from "../redux/slices/Chat";
import { loginSwitch } from "../redux/slices/Popup";
import { useParams, useRouter } from "next/navigation";
import {
  setChatLoading,
  setMessageLoading,
} from "../redux/slices/LoadingStates";

function ChatArea({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<string>("");
  const [sendDisable, setSendDisable] = useState<boolean>(true);
  const loginStatus = useAppSelector((store) => store.user.loginStatus);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selectedChat } = useAppSelector((store) => store.chat);
  const { sendRequest } = useApi();

  const params = useParams();
  const rawChatId = typeof params?.chatId === "string" ? params.chatId : "";
  const decodedChatId = rawChatId ? decodeURIComponent(rawChatId) : "";
  const chatId = decodedChatId.startsWith("c=")
    ? decodedChatId.replace("c=", "")
    : decodedChatId;
  const handleSendMessage = async () => {
    dispatch(setMessageLoading(true));
    const inputBackup = input;
    setInput("");
    try {
      if (!input || input.length <= 1) {
        toast.error("Invalid input value !");
        return;
      }
      let chatId = selectedChat?._id || null;
      if (!selectedChat) {
        await sendRequest("api/chat/new", "POST", { message: input })
          .then((result) => {
            const data = result.data as Data<Chat> | undefined;
            if (result && result.success) {
              if (data?.data) {
                const newChat = data.data;
                chatId = newChat._id;
                dispatch(setSelectChat(newChat));
                dispatch(addRecentChat(newChat));
                router.push(`/${newChat._id}`);
              } else {
                throw new Error(data?.message || "No data return");
              }
            } else {
              throw new Error(data?.message || "Failed to create new Chat");
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error(`${error.message}`);
          });
      }
      dispatch(
        addMessage([
          {
            _id: "dummy",
            role: "human",
            chatId: "dummy",
            content: input,
            images: [],
          },
        ]),
      );
      await sendRequest("api/agent/chat", "POST", {
        chatId,
        prompt: input,
      })
        .then((result) => {
          const data = result.data as Data<Message[]> | undefined;
          if (result && result.success) {
            if (data && data.data) {
              dispatch(addMessage(data.data));
              setInput("");
            }
          } else {
            throw new Error("Failed to chat with agent");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
      setInput(inputBackup);
    } finally {
      dispatch(removeDummies());
      dispatch(setMessageLoading(false));
    }
  };
  useEffect(() => {
    if (!chatId) return;
    const getChat = async () => {
      dispatch(setChatLoading(true));
      await sendRequest(`api/chat/${chatId}`)
        .then((result) => {
          const data = result.data as Data<Chat> | undefined;
          if (result && result.success) {
            if (data && data.data) {
              dispatch(setSelectChat(data.data));
            }
          } else {
            router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          dispatch(setChatLoading(false));
        });
    };
    getChat();
  }, [chatId]);
  useEffect(() => {
    if (input.trim().length > 0) {
      setSendDisable(false);
    } else {
      setSendDisable(true);
    }
  }, [input]);
  return (
    <section className="py-1 pr-1 flex flex-col w-full overflow-x-hidden">
      {/* !login header */}
      {loginStatus !== "authenticated" && (
        <article className="flex w-full overflow-hidden justify-between">
          <div className="flex py-2.5 px-1.5 gap-1 rounded-md hover:bg-bgsec active:bg-bgsec items-center cursor-pointer">
            <h3 className="font-bold">
              {process.env.NEXT_PUBLIC_PROJECT_NAME}
            </h3>
            <ChevronDown size={14} />
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="bg-white text-black rounded-full py-2 px-3 font-medium cursor-pointer text-sm"
              onClick={() => dispatch(loginSwitch(true))}
            >
              Log in
            </button>
            <button
              onClick={() => dispatch(loginSwitch(true))}
              className="bg-bgsec text-txpri rounded-full py-2 px-3 font-medium border border-borderhl cursor-pointer text-sm"
            >
              Sign up for free
            </button>
          </div>
        </article>
      )}
      <article className="flex flex-col items-center justify-center w-full h-full px-3 py-5 gap-4">
        {children}

        {/* input area */}
        <div className="flex flex-nowrap bg-bgsec border border-borderhl/60 items-center w-full max-w-160 lg:max-w-180 rounded-full p-1 sm:p-2">
          <div className="rounded-full p-2 hover:bg-borderhl/30 cursor-pointer">
            <Plus strokeWidth={1.5} size={20} className="" />
          </div>
          <textarea
            value={input}
            name="search"
            id="search"
            className="outline-none focus:outline-none w-full grow scrollbar-none resize-none"
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${process.env.NEXT_PUBLIC_PROJECT_NAME}`}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="p-2 cursor-pointer mr-2">
            <Mic strokeWidth={1.5} size={20} className="" />
          </div>
          <button
            disabled={sendDisable}
            className={`p-2 cursor-pointer ${sendDisable ? "bg-borderhl" : "bg-white"} rounded-full`}
            onClick={handleSendMessage}
          >
            <ArrowUp size={20} strokeWidth={2} className="text-black" />
          </button>
        </div>
      </article>
    </section>
  );
}

export default ChatArea;
