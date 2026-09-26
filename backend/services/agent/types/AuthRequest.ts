import { Request } from "express";
export type AuthUser = {
  _id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  gender: "male" | "female" | "other";
  dob: string;
  fid: string | null;
  actk?: string;
};
export interface AuthRequest<
  P = any,
  ResB = any,
  ReqB = any,
  ReqQ = any,
> extends Request<P, ResB, ReqB, ReqQ> {
  user?: AuthUser;
}
