import "dotenv/config";

import express from "express";
import cors from "cors";
import corsOptions from "./config/cors";
import cookieParser from "cookie-parser";
import credentials from "./middlewares/credentials";
import jwtVerifier from "./middlewares/jwtVerifier";
import { eProxy } from "./utils/eProxy";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));

// gateways
// auth and user
app.use(
  "/api/auth/user",
  jwtVerifier,
  eProxy(process.env.AUTH_SERVER as string, "/api/auth/user"),
);
app.use(
  "/api/auth/logout",
  jwtVerifier,
  eProxy(process.env.AUTH_SERVER as string, "/api/auth/user"),
);
app.use("/api/auth", eProxy(process.env.AUTH_SERVER as string, "/api/auth"));

//chat
app.use(
  "/api/chat",
  jwtVerifier,
  eProxy(process.env.CHAT_SERVER as string, "/api/chat"),
);

//agent
app.use(
  "/api/agent",
  jwtVerifier,
  eProxy(process.env.AGENT_SERVER as string, "/api/agent"),
);

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
