import "dotenv/config";

import express from "express";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import agentRouter from "./routes/Agent";

const app = express();
const PORT = process.env.PORT || 5011;
app.use(express.json());
app.use(cookieParser());
app.use("/api/agent", agentRouter);
app.listen(PORT, () => {
  console.log(`Agent Server is running on port ${PORT}`);
  connectDB();
});
