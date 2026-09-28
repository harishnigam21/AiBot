import ChatShell from "@/app/components/ChatShell";
import delay from "@/utils/delay";

export default async function Chat() {
  await delay(1000); //TODO: temperory
  return (
    <div className="p-2 grow w-full overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-borderhl flex flex-col gap-3">
      <ChatShell />
    </div>
  );
}
