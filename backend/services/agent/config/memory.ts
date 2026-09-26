import axios from "axios";
import redisConnect from "./connect";
export const getMemory = async (id: string, actk: string) => {
  const messages = await redisConnect.get(`chat-${id}`);
  if (messages) {
    return JSON.parse(messages);
  } else {
    try {
      const { data } = await axios.get(
        `${process.env.CHAT_SERVER}/api/chat/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${actk}`,
            "Content-Type": "application/json",
          },
        },
      );
      const realData = data.data;
      if (realData) {
        await redisConnect.set(
          `chat-${id}`,
          JSON.stringify(realData.messages),
          "EX",
          24 * 60 * 60,
        );
        return realData.messages;
      } else {
        throw new Error("Failed to get Chat messages from memory.ts");
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
};
export const addMessage = async (
  id: string,
  role: "ai" | "user",
  content: string,
) => {
  const messages = await redisConnect.get(`chat-${id}`);
  const updateMessage = messages ? JSON.parse(messages) : [];
  updateMessage.push({ chatId: id, role, content });
  if (updateMessage.length > 20) {
    updateMessage.shift();
  }
  await redisConnect.set(
    `chat-${id}`,
    JSON.stringify(updateMessage),
    "EX",
    24 * 60 * 60,
  );
};
