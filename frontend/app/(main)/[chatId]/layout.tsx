import type { Metadata } from "next";
import { Data } from "@/types/data";
import type { Chat } from "@/app/redux/slices/Chat";
import { serverFetch } from "@/utils/serverApi";
import ChatLayoutShell from "@/app/components/ChatLayoutShell";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ chatId: string }>;
}): Promise<Metadata> {
  const { chatId } = await params;
  const rawChatId = typeof chatId === "string" ? chatId : "";
  const decodedChatId = rawChatId ? decodeURIComponent(rawChatId) : "";
  const id = decodedChatId.startsWith("c=")
    ? decodedChatId.replace("c=", "")
    : decodedChatId;
  const responseChat = await serverFetch(`api/chat/title/${id}`, "GET");
  const responseData = responseChat.data as { title: string } | null;
  return {
    title:
      responseData?.title || `Chat | ${process.env.NEXT_PUBLIC_PROJECT_NAME}`,

    description: `User chatting with ${process.env.NEXT_PUBLIC_PROJECT_NAME}`,
  };
}
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ chatId: string }>;
}>) {
  const { chatId } = await params;
  const rawChatId = typeof chatId === "string" ? chatId : "";
  const decodedChatId = rawChatId ? decodeURIComponent(rawChatId) : "";
  const id = decodedChatId.startsWith("c=")
    ? decodedChatId.replace("c=", "")
    : decodedChatId;
  const responseChat = await serverFetch(`api/chat/${id}`, "GET");
  const dataChat = responseChat.data as Data<Chat> | null;
  return (
    <>
      <ChatLayoutShell dataChat={dataChat?.data || null} />
      {children}
    </>
  );
}
