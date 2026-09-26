import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtVerifier = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        message: "Authorization token required",
        issue: "not authenticated",
      });
    }

    // Expected format:
    // Authorization: Bearer <token>

    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization format",
        issue: "invalid token format",
      });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_KEY as string,
    );

    console.log("Gateway: JWT verified successfully");

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Auth token expired. Please refresh.",
        issue: "token expired",
      });
    }

    if (err instanceof jwt.NotBeforeError) {
      return res.status(401).json({
        error: "Token is not active yet.",
        issue: "token not active",
      });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Token is malformed or invalid.",
        issue: "invalid token",
      });
    }

    console.error("Gateway JWT Verifier Error:", err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default jwtVerifier;