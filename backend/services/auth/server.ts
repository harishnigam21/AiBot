import "dotenv/config";

import express from "express";
import { connectDB } from "./config/db";
import routerAuth from "./routes/Auth";
import cookieParser from "cookie-parser";
import routerUser from "./routes/User";

const app = express();
const PORT = process.env.PORT || 5009;
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", routerAuth);
app.use("/api/auth", routerUser);

app.listen(PORT, () => {
  console.log(`Auth Server is running on port ${PORT}`);
  connectDB();
});
