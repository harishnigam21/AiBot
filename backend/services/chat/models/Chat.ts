import mongoose from "mongoose";
export interface IChat extends Document {
  title: string;
  userId: mongoose.Types.ObjectId;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const ChatSchema = new mongoose.Schema<IChat>(
  {
    title: {
      type: String,
      required: true,
      default: "New Chat",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
export default mongoose.model<IChat>("chat", ChatSchema);
