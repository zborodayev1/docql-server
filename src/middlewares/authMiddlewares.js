import jwt from "jsonwebtoken";
import * as env from "../config/env.js";
import { generateAccessToken } from "../services/auth.service.js";
import { logger } from "../utils/logger.js";

export const checkAuth = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  let accessToken = req.cookies.accessToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!accessToken) {
    accessToken = generateAccessToken(req, res);
  }

  try {
    const decoded = jwt.verify(accessToken, env.ACCESS_JWT_SECRET);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

export const checkAdmin = (role) => (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  let accessToken = req.cookies.accessToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!accessToken) {
    accessToken = generateAccessToken(req, res);
  }
  try {
    const decoded = jwt.verify(accessToken, env.ACCESS_JWT_SECRET);

    if (decoded.role !== role) {
      return res.status(401).json({ message: "Access denied" });
    }

    req.userId = decoded.id;
    req.role = decoded.role;

    return next();
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

export const checkNotAuth = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    return res.status(401).json({ message: "You are already authenticated" });
  }
  next();
};
