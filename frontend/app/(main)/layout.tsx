import ChatArea from "../components/ChatArea";
import LoginPopup from "../components/LoginPopup";
import MainLayoutData from "../components/MainLayoutData";
import ScreenSize from "../components/ScreenSize";
import SideBar from "../components/SideBar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <article className="relative w-full h-screen overflow-hidden text-txpri">
      <MainLayoutData />
      <ScreenSize />
      <section className="flex flex-nowrap w-full h-full">
        <SideBar />
        <ChatArea children={children} />
      </section>
      <LoginPopup />
    </article>
  );
}
