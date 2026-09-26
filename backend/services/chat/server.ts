import "dotenv/config";

import express from "express";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/Chat";

const app = express();
const PORT = process.env.PORT || 5010;
app.use(express.json());
app.use(cookieParser());
app.use("/api/chat", chatRouter);
app.listen(PORT, () => {
  console.log(`Chat Server is running on port ${PORT}`);
  connectDB();
});
