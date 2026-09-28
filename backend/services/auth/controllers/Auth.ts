import User from "../models/User";
import { Request, Response } from "express";
import { app } from "../utils/firebase";
import { getAuth } from "firebase-admin/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getServerError } from "../utils/serverError";
import { AuthRequest } from "../types/AuthRequest";
import cloudinary from "../utils/cloudinary";
import redisConnect from "../config/connect";
import { env } from "node:process";
const in_production = process.env.IN_PRODUCTION === "true";

export const LogIn = async (req: Request, res: Response) => {
  const { token, email } = req.body;
  try {
    if (!token && !email) {
      return res.status(400).json({ messgae: "Invalid Login" });
    }
    if (token) {
      const decoded = await getAuth(app).verifyIdToken(token);
      const ExistingUser = await User.findOne({ fid: decoded.uid });
      if (!ExistingUser) {
        const name = decoded.name;
        const splitName = name.split(" ");
        const firstname = splitName[0];
        const lastname = splitName.slice(1).join(" ");

        const newUser = new User({
          fid: decoded.uid,
          firstName: firstname,
          lastName: lastname || "",
          email: decoded.email,
          pic: decoded.picture,
        });

        const access_token = jwt.sign(
          { id: newUser._id },
          process.env.ACCESS_TOKEN_KEY as string,
          { expiresIn: "1d" },
        );
        const refresh_token = jwt.sign(
          { id: newUser._id },
          process.env.REFRESH_TOKEN_KEY as string,
          { expiresIn: "7d" },
        );
        if (decoded.picture) {
          const upload = await cloudinary.uploader.upload(decoded.picture, {
            folder: `${process.env.CLOUDINARY_ROOT}/profile/${newUser._id}/pic`,
            resource_type: "image",
          });
          newUser.pic = upload.secure_url;
        }
        newUser.refreshToken = refresh_token;
        await newUser.save();
        res.cookie("actk", access_token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: in_production,
          sameSite: in_production ? "none" : "lax",
          domain: process.env.TOP_DOMAIN,
        });
        res.cookie("jwt", refresh_token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: in_production,
          sameSite: in_production ? "none" : "lax",
          domain: process.env.TOP_DOMAIN,
        });
        const eUser = {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          pic: newUser.pic,
          gender: newUser.gender,
          dob: newUser.dob,
          email: newUser.email,
        };
        await redisConnect.set(
          `userInfo-${newUser._id}`,
          JSON.stringify(eUser),
          "EX",
          7 * 24 * 60 * 60,
        );

        return res.status(201).json({
          data: eUser,
          actk: access_token,
        });
      }
      const access_token = jwt.sign(
        { id: ExistingUser._id },
        process.env.ACCESS_TOKEN_KEY as string,
        { expiresIn: "1d" },
      );
      const refresh_token = jwt.sign(
        { id: ExistingUser._id },
        process.env.REFRESH_TOKEN_KEY as string,
        { expiresIn: "7d" },
      );
      const updateRefreshToken = await User.findByIdAndUpdate(
        ExistingUser._id,
        {
          $set: { refreshToken: refresh_token },
        },
        { returnDocument: "after", runValidators: true },
      );
      if (!updateRefreshToken) {
        throw new Error("Failed to update refresh token");
      }
      const eUser = {
        _id: updateRefreshToken._id,
        firstName: updateRefreshToken.firstName,
        lastName: updateRefreshToken.lastName,
        pic: updateRefreshToken.pic,
        gender: updateRefreshToken.gender,
        dob: updateRefreshToken.dob,
        email: updateRefreshToken.email,
      };
      await redisConnect.set(
        `userInfo-${updateRefreshToken._id}`,
        JSON.stringify(eUser),
        "EX",
        7 * 24 * 60 * 60,
      );
      res.cookie("actk", access_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: in_production,
        sameSite: in_production ? "none" : "lax",
        domain: process.env.TOP_DOMAIN,
      });
      res.cookie("jwt", refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: in_production,
        sameSite: in_production ? "none" : "lax",
        domain: process.env.TOP_DOMAIN,
      });
      return res.status(200).json({
        data: eUser,
        actk: access_token,
      });
    }
    const ExistingUser = await User.findOne({ email })
      .select("+password +_id")
      .lean();

    if (!ExistingUser) {
      console.error("Non-Registered User trying to login : ", email);
      return res.status(404).json({ message: "You are not registered yet !" });
    }
    if (ExistingUser && !ExistingUser.password) {
      return res
        .status(400)
        .json({ message: "Please use direct login or register yourself" });
    }
    const comparePassword = await bcrypt.compare(
      req.body.password,
      ExistingUser.password!,
    );
    if (!comparePassword) {
      console.error("Incorrect password received from : ", ExistingUser.email);
      return res
        .status(401)
        .json({ message: "Incorrect Password, Please try again" });
    }
    const access_token = jwt.sign(
      { id: ExistingUser._id },
      process.env.ACCESS_TOKEN_KEY as string,
      { expiresIn: "1d" },
    );
    const refresh_token = jwt.sign(
      { id: ExistingUser._id },
      process.env.REFRESH_TOKEN_KEY as string,
      { expiresIn: "7d" },
    );
    const updateRefreshToken = await User.findByIdAndUpdate(
      ExistingUser._id,
      {
        $set: { refreshToken: refresh_token },
      },
      { returnDocument: "after", runValidators: true },
    );
    if (!updateRefreshToken) {
      throw new Error("Failed to update refresh token");
    }
    const eUser = {
      _id: updateRefreshToken._id,
      firstName: updateRefreshToken.firstName,
      lastName: updateRefreshToken.lastName,
      pic: updateRefreshToken.pic,
      gender: updateRefreshToken.gender,
      dob: updateRefreshToken.dob,
      email: updateRefreshToken.email,
    };
    await redisConnect.set(
      `userInfo-${updateRefreshToken._id}`,
      JSON.stringify(eUser),
      "EX",
      7 * 24 * 60 * 60,
    );
    res.cookie("actk", access_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: in_production,
      sameSite: in_production ? "none" : "lax",
      domain: process.env.TOP_DOMAIN,
    });
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: in_production,
      sameSite: in_production ? "none" : "lax",
      domain: process.env.TOP_DOMAIN,
    }); //TODO: add secure:true at production level
    console.log("Successfully Verified User : ", ExistingUser.email);
    return res.status(200).json({
      message: "Successfully Verified User",
      actk: access_token,
      data: eUser,
    });
  } catch (error) {
    getServerError(res, error, "LogIn controller");
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ data: req.user });
};
