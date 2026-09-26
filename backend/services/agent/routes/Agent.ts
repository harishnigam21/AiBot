import express from "express";
import jwtVerifier from "../middlewares/jwtVerifier";
import { Agent } from "../controllers/Agent";
const router = express.Router();
router.route("/chat").post(jwtVerifier, Agent);
export default router;
