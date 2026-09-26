import mongoose from "mongoose";
export interface IMessage {
  chatId: mongoose.Types.ObjectId;
  role: "ai" | "user";
  content: string;
  images: string[];
}
const messageSchema = new mongoose.Schema<IMessage>(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["ai", "user"],
      default: "ai",
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: null,
    },
  },
  { timestamps: true },
);
export default mongoose.model<IMessage>("message", messageSchema);
