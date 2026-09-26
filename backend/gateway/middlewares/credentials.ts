import { whitelist } from "../config/whitelist";
import { Request, Response, NextFunction } from "express";
//This middleware checks request coming, is included in our whitelist or not, this handles CORS
const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (!origin || whitelist.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");

    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
  }

  next();
};
export default credentials;
