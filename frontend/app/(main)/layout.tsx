import { serverFetch } from "@/utils/serverApi";
import ChatArea from "../components/ChatArea";
import LoginPopup from "../components/LoginPopup";
import MainLayoutData from "../components/MainLayoutData";
import ScreenSize from "../components/ScreenSize";
import SideBar from "../components/SideBar";
import { Data } from "@/types/data";
import { RecentChat } from "../redux/slices/Chat";
import { User } from "../redux/slices/User";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const responseUser = await serverFetch(`api/auth/user`, "GET");
  const responseList = await serverFetch(`api/chat/recent`, "GET");
  const dataUser = responseUser.data as Data<User> | null;
  const dataList = responseList.data as Data<{
    recent: RecentChat[];
    pinned: RecentChat[];
  }> | null;
  return (
    <article className="relative w-full h-screen overflow-hidden text-txpri">
      <MainLayoutData
        dataUser={dataUser?.data || null}
        dataList={dataList?.data || null}
      />
      <ScreenSize />
      <section className="flex flex-nowrap w-full h-full">
        <SideBar />
        <ChatArea children={children} />
      </section>
      <LoginPopup />
    </article>
  );
}
