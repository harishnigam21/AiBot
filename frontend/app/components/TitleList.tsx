import {
  Archive,
  Ellipsis,
  LucideIcon,
  Pencil,
  Share,
  Trash,
} from "lucide-react";
import { Chat, RecentChat } from "../redux/slices/Chat";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TitleList({
  item,
  selectedChat,
  Picon,
  Pname,
  PClick,
}: {
  item: RecentChat;
  selectedChat: Chat | null;
  Pname: string;
  Picon: LucideIcon;
  PClick: (id: string) => void;
}) {
  const router = useRouter();

  const optionRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<boolean>(false);

  const [measurement, setMeasurement] = useState<{
    top: number;
    width: number;
    height: number;
    left: number;
    bottom: number;
  } | null>(null);

  const [optionDirection, setOptionDirection] = useState<{
    dir: "top" | "bottom";
    value: number;
  }>({ dir: "bottom", value: 0 });

  const updateMeasurement = () => {
    if (!optionRef.current) return;
    const data = optionRef.current.getBoundingClientRect();
    if (window.innerHeight - data.bottom <= 250) {
      setOptionDirection({
        dir: "bottom",
        value: window.innerHeight - data.bottom + 20,
      });
    } else {
      setOptionDirection({ dir: "top", value: data.top + data.height - 5 });
    }
    setMeasurement({
      top: data.top,
      width: data.width,
      left: data.left,
      height: data.height,
      bottom: data.bottom,
    });
  };

  useEffect(() => {
    if (!options) return;
    updateMeasurement();
    const handleScroll = () => {
      updateMeasurement();
    };
    window.addEventListener(
      "scroll",
      () => {
        setOptions(false);
        handleScroll();
      },
      true,
    );
    return () => {
      window.removeEventListener(
        "scroll",
        () => {
          setOptions(false);
          handleScroll();
        },
        true,
      );
    };
  }, [options]);

  useEffect(() => {
    if (!options) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) {
        setOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [options]);

  return (
    <div
      ref={optionRef}
      className={`relative group justify-between flex rounded-lg items-center ${selectedChat?._id == item._id && "bg-bgsec/90"} p-2 cursor-pointer hover:bg-bgsec/90 active:bg-bgsec/90 ${options && "bg-bgsec/90"}`}
    >
      <p
        onClick={() => {
          router.push(`/c=${item._id}`);
        }}
        className="font-thin text-sm break-all line-clamp-1 grow"
      >
        {item.title}
      </p>
      <div
        className={`${options ? "flex" : "hidden"} text-txsec flex-nowrap gap-4 items-center self-center mt-1 group-hover:flex group-active:flex`}
      >
        <Picon
          size={16}
          className="rotate-45 hover:text-txpri transition-all"
          onClick={() => {
            PClick(item._id);
          }}
        />
        <Ellipsis
          onClick={() => setOptions((prev) => !prev)}
          size={16}
          className=" hover:text-txpri transition-all"
        />
      </div>
      {measurement && options && (
        <div
          ref={fieldRef}
          style={{
            ...(optionDirection.dir == "top"
              ? { top: `${optionDirection.value}px` }
              : { bottom: `${optionDirection.value}px` }),
            left: `${measurement.left + measurement.width - 40}px`,
          }}
          className={`fixed bg-bgsec z-100 flex flex-col outline-none focus:outline-none items-center rounded-2xl p-2 text-txpri/95`}
        >
          <div>
            <div className="py-2 px-4 hover:bg-borderhl/80 transition-all w-full rounded-xl flex flex-nowrap gap-2 items-center">
              <Share size={18} />
              <p className="text-sm">Share</p>
            </div>
            <div className="py-2 px-4 hover:bg-borderhl/80 transition-all w-full rounded-xl flex flex-nowrap gap-2 items-center">
              <Pencil size={18} />
              <p className="text-sm">Rename</p>
            </div>
          </div>
          <hr className="border border-borderhl/40 w-full my-2" />
          <div>
            <div
              className="py-2 px-4 hover:bg-borderhl/80 transition-all w-full rounded-xl flex flex-nowrap gap-2 items-center"
              onClick={() => {
                PClick(item._id);
              }}
            >
              <Picon className="rotate-45" size={18} />
              <p className="text-sm">{Pname} Chat</p>
            </div>
            <div className="py-2 px-4 hover:bg-borderhl/80 transition-all w-full rounded-xl flex flex-nowrap gap-2 items-center">
              <Archive size={18} />
              <p className="text-sm">Archive</p>
            </div>
            <div className="py-2 px-4 hover:bg-borderhl/80 transition-all w-full rounded-xl flex flex-nowrap gap-2 items-center">
              <Trash size={18} />
              <p className="text-sm">Delete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
