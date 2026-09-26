import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import Message from "../models/Message";
import { getServerError } from "../utils/serverError";

export const saveMessage = async (req: AuthRequest, res: Response) => {
  const { chatId, role, content, images } = req.body;
  try {
    const message = await Message.create({ chatId, role, content, images });
    return res.status(201).json({
      data: {
        _id: message._id,
        chatId: message.chatId,
        role: message.role,
        content: message.content,
        images: message.images,
      },
    });
  } catch (error) {
    getServerError(res, error, "saveMessage");
  }
};
