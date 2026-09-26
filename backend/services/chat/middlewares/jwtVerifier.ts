import { NextFunction, Response } from "express";
import axios from "axios";
import { AuthRequest } from "../types/AuthRequest";
import { getServerError } from "../utils/serverError";
const jwtVerifier = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      return res.status(400).json({
        message: "Looks Like you have not login yet",
        issue: "not verified",
      });
    }
    const token = header.split(" ")[1]; // bearer token...
    if (!token) {
      return res
        .status(403)
        .json({ message: "Invalid token format", issue: "not verified" });
    }
    await axios
      .get(`${process.env.AUTH_SERVER}/api/auth/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
      })
      .then((response) => {
        req.user = response.data.data;
      })
      .catch((error) => {
        throw new Error(
          `Chat jwtVerifier Error while fetching auth api - ${error}`,
        );
      });
    next();
  } catch (err) {
    getServerError(res, err, "Chat JwtVerifier");
  }
};
export default jwtVerifier;
