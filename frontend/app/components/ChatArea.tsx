"use client";
import { ArrowUp, ChevronDown, Mic, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { useRouter } from "next/navigation";
import { setMessageLoading } from "../redux/slices/LoadingStates";

function ChatArea({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<string>("");
  const [sendDisable, setSendDisable] = useState<boolean>(true);
  const [switchTextArea, setSwitchTextArea] = useState<boolean>(false);
  const loginStatus = useAppSelector((store) => store.user.loginStatus);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selectedChat } = useAppSelector((store) => store.chat);
  const { sendRequest } = useApi();

  const handleSendMessage = async () => {
    dispatch(setMessageLoading(true));
    const inputBackup = input;
    setInput("");
    setSwitchTextArea(false);
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
                dispatch(
                  addRecentChat({
                    _id: newChat._id,
                    title: newChat.title,
                    pinned: newChat.pinned,
                    createdAt: newChat.createdAt,
                  }),
                );
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
    if (input.trim().length > 0) {
      setSendDisable(false);
    } else {
      setSendDisable(true);
    }
  }, [input]);

  return (
    <section className=" pr-1 flex flex-col w-full overflow-x-hidden">
      {/* !login header */}
      {loginStatus !== "authenticated" && (
        <article className="flex w-full overflow-hidden justify-between p-0.5">
          <div className="flex py-2.5 px-1.5 gap-1 rounded-md hover:bg-bgsec active:bg-bgsec items-center cursor-pointer">
            <h3 className="font-bold">
              {process.env.NEXT_PUBLIC_PROJECT_NAME}
            </h3>
            <ChevronDown size={14} />
          </div>
          <div className="flex gap-2 items-center whitespace-nowrap">
            <button
              className="bg-white text-black rounded-full py-2 px-3 font-medium cursor-pointer text-sm"
              onClick={() => dispatch(loginSwitch(true))}
            >
              Log in
            </button>
            <button
              onClick={() => dispatch(loginSwitch(true))}
              className="bg-bgsec text-txpri rounded-full py-2 px-3 font-medium border border-borderhl cursor-pointer text-sm hidden sm:block"
            >
              Sign up for free
            </button>
          </div>
        </article>
      )}
      <article className="flex flex-col items-center justify-center w-full h-full pb-5 gap-4">
        {children}

        {/* input area */}
        <div className="px-4 w-full flex flex-col justify-center items-center">
          <div className="flex flex-col flex-nowrap bg-bgsec border border-borderhl/60 items-center min-w-50 max-w-160 w-full rounded-3xl p-1.5">
            {switchTextArea && (
              <div className="p-1 h-fit overflow-hidden w-full">
                <TextArea
                  input={input}
                  setInput={setInput}
                  setSwitchTextArea={setSwitchTextArea}
                  handleSendMessage={handleSendMessage}
                />
              </div>
            )}
            <div className="flex flex-nowrap justify-between items-center w-full">
              <div className="rounded-full p-2 hover:bg-borderhl/30 cursor-pointer flex self-end">
                <Plus strokeWidth={1.5} size={20} className="" />
              </div>
              {!switchTextArea && (
                <TextArea
                  input={input}
                  setInput={setInput}
                  setSwitchTextArea={setSwitchTextArea}
                  handleSendMessage={handleSendMessage}
                />
              )}
              <div className="flex flex-nowrap self-end">
                <div className="p-2 cursor-pointer mr-2">
                  <Mic strokeWidth={1.5} size={20} className="" />
                </div>
                <button
                  disabled={sendDisable}
                  className={`p-2 cursor-pointer ${sendDisable ? "bg-borderhl text-black" : "bg-pri text-white"} rounded-full`}
                  onClick={handleSendMessage}
                >
                  <ArrowUp size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ChatArea;

const TextArea = ({
  input,
  setInput,
  setSwitchTextArea,
  handleSendMessage,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setSwitchTextArea: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (input && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  return (
    <textarea
      ref={textareaRef}
      value={input}
      name="search"
      id="search"
      className="outline-none focus:outline-none w-full grow scrollbar-thin scrollbar-thumb-borderhl resize-none max-h-60"
      rows={1}
      onChange={(e) => {
        const textarea = e.target;
        setInput(textarea.value);
        textarea.style.height = "auto";
        const isMoreThanOneRow = textarea.scrollHeight > textarea.clientHeight;
        setSwitchTextArea(isMoreThanOneRow);
      }}
      placeholder={`Ask anything`}
      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      }}
    />
  );
};
