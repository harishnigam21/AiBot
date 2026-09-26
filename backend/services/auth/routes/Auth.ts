import express from "express";
import { LogIn } from "../controllers/Auth";
const router = express.Router();
router.route("/login").post(LogIn);
export default router;
