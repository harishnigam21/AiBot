import { AuthRequest } from "../types/AuthRequest";
import { Response } from "express";
import { getServerError } from "../utils/serverError";
import Chat from "../models/Chat";
import Message from "../models/Message";
import mongoose from "mongoose";

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
        createdAt: chat.createdAt,
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
      .select("title pinned createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const pinned = chat.filter((item) => item.pinned);
    const recent = chat.filter((item) => !item.pinned);
    return res
      .status(200)
      .json({ data: { pinned: pinned || [], recent: recent || [] } });
  } catch (error) {
    getServerError(res, error, "recentChatList");
  }
};

export const pinChat = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findOneAndUpdate(
      { userId: req.user?._id, _id: id },
      {
        $set: {
          pinned: true,
        },
      },
      {
        new: true,
        projection: {
          _id: 1,
          pinned: 1,
          title: 1,
          createdAt: 1,
        },
      },
    );
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    return res.status(200).json({ data: chat });
  } catch (error) {
    getServerError(res, error, "pinChat");
  }
};

export const unpinChat = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findOneAndUpdate(
      { userId: req.user?._id, _id: id },
      {
        $set: {
          pinned: false,
        },
      },
      {
        new: true,
        projection: {
          _id: 1,
          pinned: 1,
          title: 1,
          createdAt: 1,
        },
      },
    );
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    return res.status(200).json({ data: chat });
  } catch (error) {
    getServerError(res, error, "pinChat");
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

export const getTitle = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const chatExist = await Chat.findOne({
      _id: id as string,
      userId: req.user?._id,
    });
    if (!chatExist) {
      return res.status(400).json({ message: "No such chat exist" });
    }
    return res.status(200).json({
      title: chatExist.title,
    });
  } catch (error) {
    getServerError(res, error, "getChat");
  }
};
// TODO: Currently I don't think to delete this chat from redis also because redis will vanish automatically in a day
export const deleteChat = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const chatExist = await Chat.findOne({
      userId: req.user?._id,
      _id: id,
    }).session(session);
    if (!chatExist) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Chat doesn't exist" });
    }
    await Chat.deleteOne({ _id: chatExist._id }).session(session);
    await Message.deleteMany({ chatId: chatExist._id }).session(session);
    await session.commitTransaction();
    return res.status(200).json({ id: chatExist._id });
  } catch (error) {
    await session.abortTransaction();
    getServerError(res, error, "deleteChat");
  } finally {
    await session.endSession();
  }
};
