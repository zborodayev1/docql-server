import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import * as env from "../config/env.js";

export const findExistingUser = (where, select) =>
  prisma.user.findUnique({
    where,
    select,
  });

export const createUser = (data, select) =>
  prisma.user.create({
    data,
    select,
  });

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(env.SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  return { hash };
};

export const generateTokens = (res, userId, role) => {
  const refreshToken = jwt.sign({ id: userId, role: role }, env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });

  const accessToken = jwt.sign({ id: userId, role: role }, env.ACCESS_JWT_SECRET, {
    expiresIn: "15m",
  });

  res.clearCookie("refreshToken");

  res.clearCookie("accessToken");

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15m
  });

  return { accessToken, refreshToken };
};

export const generateAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(refreshToken, env.REFRESH_JWT_SECRET);

  const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, env.ACCESS_JWT_SECRET, {
    expiresIn: "15m",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15m
  });

  return accessToken;
};

export const validate = (schema, params) => {
  const validateData = schema.safeParse(params);

  if (!validateData.success) {
    throw validateData.error;
  }

  return validateData.data;
};

export const validatePassword = async (password, hash) => {
  const isPasswordValid = await bcrypt.compare(password, hash);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
};
