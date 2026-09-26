import express from "express";
import { getUser } from "../controllers/Auth";
import jwtVerifier from "../middlewares/jwtVerifier";
const router = express.Router();
router.route("/user").get(jwtVerifier, getUser);
export default router;
