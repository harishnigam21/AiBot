import mongoose from "mongoose";
export interface IUser extends Document {
  fid: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
  gender: string;
  dob: string;
  pic: string | null;
  password: string;
  refreshToken: string;
}
const UserSchema = new mongoose.Schema(
  {
    fid: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    dob: {
      type: String,
      default: "",
    },
    pic: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
      default: "",
    },
  },
  { timestamps: true },
);
export default mongoose.model("user", UserSchema);
