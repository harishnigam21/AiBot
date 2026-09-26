import { Response } from "express";
import { getServerError } from "../utils/serverError";
import axios from "axios";
import { graph } from "../graph/graph";
import { AuthRequest } from "../types/AuthRequest";
import { addMessage } from "../config/memory";
export const Agent = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId, prompt } = req.body;

    const result = await graph.invoke({ prompt, chatId, actk: req.user?.actk });
    const response = result.aiResponse;
    const responseImages = result.images;

    await addMessage(chatId, "user", prompt);
    await addMessage(chatId, "ai", response);
    const saveMessageUser = await axios.post(
      `${process.env.CHAT_SERVER}/api/chat/message`,
      {
        chatId,
        content: prompt,
        role: "user",
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${req.user?.actk}`,
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
      },
    );
    const saveMessageAI = await axios.post(
      `${process.env.CHAT_SERVER}/api/chat/message`,
      {
        chatId,
        content: response,
        images: responseImages,
        role: "ai",
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${req.user?.actk}`,
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
      },
    );
    const userSide = saveMessageUser.data.data;
    const aiSide = saveMessageAI.data.data;
    return res.status(200).json({ data: [userSide, aiSide] });
  } catch (error) {
    getServerError(res, error, "Agent");
  }
};
