import { AuthRequest } from "../types/AuthRequest";
import { Response } from "express";
import { getServerError } from "../utils/serverError";
import Chat from "../models/Chat";
import Message from "../models/Message";

export const newChat = async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  try {
    const chat = await Chat.create({
      title: message.trim().slice(0, 100) || "New Chat",
      userId: req.user?._id,
    });
    return res.status(201).json({
      data: {
        _id: chat._id,
        title: chat.title,
        pinned: chat.pinned,
        messages: [],
      },
    });
  } catch (error) {
    getServerError(res, error, "newChat");
  }
};

export const recentChatList = async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.find({ userId: req.user?._id })
      .select("title pinned")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ data: chat });
  } catch (error) {
    getServerError(res, error, "recentChatList");
  }
};

export const getChat = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const chatExist = await Chat.findOne({
      _id: id as string,
      userId: req.user?._id,
    });
    if (!chatExist) {
      return res.status(400).json({ message: "No such chat exist" });
    }
    const messages = await Message.find({ chatId: chatExist._id })
      .select("chatId role content images")
      .sort({ createdAt: 1 })
      .lean();
    return res.status(200).json({
      data: {
        _id: chatExist._id,
        title: chatExist.title,
        pinned: chatExist.pinned,
        messages,
      },
    });
  } catch (error) {
    getServerError(res, error, "getChat");
  }
};
