import jwt from "jsonwebtoken";
import * as env from "../config/env.js";
import { UnauthorizedError, ValidationError } from "../errors-class.js";
import * as service from "../services/auth.service.js";
import { generateAccessToken } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signInValidateSchema, signUpValidateSchema } from "../validators/auth.validator.js";

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = service.validate(signUpValidateSchema, req.body);

  const existingUser = await service.findExistingUser({ email }, { id: true });

  if (existingUser) throw new ValidationError("User already exists");

  const { hash } = await service.hashPassword(password);

  if (!hash) {
    return res.status(500).json({ error: "Failed to hash password" });
  }

  const user = await service.createUser(
    {
      name: name,
      email,
      password: hash,
    },
    {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  );

  service.generateTokens(res, user.id, user.role);

  res.status(201).json({
    user: user,
    message: "Registration completed successfully!",
  });
});

export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = service.validate(signInValidateSchema, req.body);

  const existingUser = await service.findExistingUser(
    { email },
    {
      id: true,
      name: true,
      email: true,
      password: true,
      createdAt: true,
      role: true,
    },
  );

  if (!existingUser) throw new ValidationError("Invalid email or password");

  await service.validatePassword(password, existingUser.password);

  service.generateTokens(res, existingUser.id, existingUser.role);

  const { password: _, role: __, ...user } = existingUser;

  res.status(200).json({
    user: user,
    message: "Login successful!",
  });
});

export const signOut = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logout successful!" });
};

export const getMe = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  let accessToken = req.cookies.accessToken;

  if (!refreshToken) throw new UnauthorizedError("Unauthorized");

  if (!accessToken) {
    accessToken = generateAccessToken(req, res);
  }

  const decoded = jwt.verify(accessToken, env.ACCESS_JWT_SECRET);
  const userId = decoded.id;

  const user = await service.findExistingUser(
    { id: userId },
    {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  );

  return res.status(200).json({ user });
});
