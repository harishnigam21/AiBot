import express from "express";
import jwtVerifier from "../middlewares/jwtVerifier";
import {
  getChat,
  getTitle,
  newChat,
  pinChat,
  recentChatList,
  unpinChat,
} from "../controllers/Chat";
import { saveMessage } from "../controllers/Messages";
const router = express.Router();
router.route("/new").post(jwtVerifier, newChat);
router.route("/pin/:id").get(jwtVerifier, pinChat);
router.route("/unpin/:id").get(jwtVerifier, unpinChat);
router.route("/recent").get(jwtVerifier, recentChatList);
router.route("/:id").get(jwtVerifier, getChat);
router.route("/title/:id").get(jwtVerifier, getTitle);
router.route("/message").post(jwtVerifier, saveMessage);
export default router;
