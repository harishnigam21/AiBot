"use client";
import {
  AtSign,
  FolderClosed,
  HelpingHand,
  Hexagon,
  Images,
  LibraryBig,
  PanelLeftClose,
  PanelLeftOpen,
  PenSquare,
  Search,
  Settings,
  Store,
  Telescope,
} from "lucide-react";
import LogoDark from "../assets/svg/LogoDark";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { loginSwitch } from "../redux/slices/Popup";
import { startNewChat } from "../redux/slices/Chat";
import { useRouter } from "next/navigation";
import Recent from "./Recent";

export default function SideBar() {
  const [barStatus, setBarStatus] = useState<boolean>(true);
  const { userInfo, loginStatus } = useAppSelector((store) => store.user);
  const { screenSize } = useAppSelector((store) => store.layout);
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    if (screenSize.width < 580) {
      setBarStatus(false);
    } else {
      setBarStatus(true);
    }
  }, [screenSize]);
  return (
    <section
      className={`flex flex-col ${barStatus ? "w-40 md:w-50 lg:w-65" : "min-w-fit"} max-h-full ${screenSize.width < 580 && barStatus && "fixed left-0 top-0 h-full bg-bgpri"} overflow-hidden scrollbar-thin scrollbar-thumb-borderhl border-r border-border transition-all`}
    >
      {/*1st part - logo and side toggle */}
      <div className="flex flex-nowrap items-center justify-between p-2 mb-2">
        {barStatus && (
          <div className="size-6">
            <LogoDark />
          </div>
        )}
        <div
          className="cursor-pointer"
          onClick={() => setBarStatus((prev) => !prev)}
        >
          {barStatus ? (
            <PanelLeftClose size={18} className="text-txpri" />
          ) : (
            <PanelLeftOpen size={18} className="text-txpri" />
          )}
        </div>
      </div>
      {/* 2nd part - new chat and other features */}
      <div className="flex h-full flex-col justify-between">
        <div className="flex h-30 grow flex-col">
          <div
            className={`p-1 ${barStatus && "pl-1"} flex flex-col gap-0.5 scrollbar-thin overflow-y-auto`}
          >
            {[
              {
                label: "New Chat",
                icon: PenSquare,
                login: "both",
                onClick: () => {
                  dispatch(startNewChat());
                  router.push("/");
                },
              },
              {
                label: "Library",
                icon: LibraryBig,
                login: true,
                onclick: () => {},
              },
              {
                label: "Projects",
                icon: FolderClosed,
                login: true,
                onclick: () => {},
              },
              {
                label: "Search chats",
                icon: Search,
                login: false,
                onclick: () => {},
              },
              {
                label: "Images",
                icon: Images,
                login: false,
                onclick: () => {},
              },
              {
                label: "Deep research",
                icon: Telescope,
                login: false,
                onclick: () => {},
              },
              {
                label: "Plugins",
                icon: AtSign,
                login: "both",
                onclick: () => {},
              },
            ].map((item, i) => {
              const lgst = loginStatus == "authenticated";
              if (
                item.login == "both" ||
                item.login.toString() == lgst.toString()
              ) {
                return (
                  <div
                    onClick={item.onClick}
                    key={`sidebar/vert/1/${i}`}
                    className={`flex rounded-lg items-center ${!barStatus && "justify-center"} p-2 gap-2 cursor-pointer hover:bg-bgsec/90 active:bg-bgsec/90`}
                  >
                    <item.icon size={18} strokeWidth={1.5} />
                    {barStatus && (
                      <p className="font-thin text-sm">{item.label}</p>
                    )}
                  </div>
                );
              }
            })}
          </div>
          {loginStatus == "authenticated" && barStatus && (
            <div className="flex flex-col">
              {/* pinned */}

              {/* Recent */}
              <Recent />
            </div>
          )}
        </div>

        {/*3rd part - pricing, setting and help navigation */}
        <div className="flex flex-col">
          {loginStatus !== "authenticated" && (
            <div
              className={`p-1 ${barStatus && "pl-3"} flex flex-col gap-0.5 border-t border-border`}
            >
              {[
                { label: "See plans and pricing", icon: Hexagon },
                { label: "Settings", icon: Settings },
                { label: "Help", icon: HelpingHand },
              ].map((item, i) => (
                <div
                  key={`sidebar/vert/2/${i}`}
                  className={`flex rounded-lg items-center ${!barStatus && "justify-center"} p-2 gap-2 cursor-pointer hover:bg-bgsec/90 active:bg-bgsec/90`}
                >
                  <item.icon size={18} strokeWidth={1.5} />
                  {barStatus && (
                    <p className="font-thin text-sm">{item.label}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* toggle portion between login user and non login user
                login button for non login user
                There name and pic if user logged in
        */}
          {/* if not loginned */}
          {barStatus && (
            <div>
              {loginStatus == "authenticated" && userInfo ? (
                <div className="p-4 flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 aspect-square text-[10px] font-thin rounded-full flex items-center justify-center bg-orange-500 overflow-hidden">
                      {userInfo.pic ? (
                        <img
                          src={userInfo.pic}
                          alt="user pic"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <b>
                          {userInfo?.firstName[0]}
                          {userInfo?.lastName[0]}
                        </b>
                      )}
                    </div>
                    <div className="flex flex-col justify-between">
                      <small className="break-all line-clamp-1">
                        {userInfo?.firstName} {userInfo?.lastName}
                      </small>
                      {/* TODO: later sync with your plan */}
                      <small className="text-txpri/80">Free</small>
                    </div>
                  </div>
                  <div className="cursor-pointer">
                    <Store size={16} className="text-txpri/80" />
                  </div>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-2 border-t border-border">
                  <p className="text-sm font-medium">
                    Get responses tailored to you
                  </p>
                  <p className="text-sm font-thin text-txpri/80">
                    Log in to get answers based on saved chats, plus create
                    images and upload files.
                  </p>
                  <button
                    className="py-3 px-4 rounded-full bg-bgsec border border-borderhl text-sm font-medium cursor-pointer"
                    onClick={() => dispatch(loginSwitch(true))}
                  >
                    Log in
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
