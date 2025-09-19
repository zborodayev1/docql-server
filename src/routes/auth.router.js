import express from "express";
import * as controller from "../controllers/auth.controller.js";
import { checkAuth, checkNotAuth } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/sign-in", checkNotAuth, controller.signIn);

router.post("/sign-up", checkNotAuth, controller.signUp);

router.get("/sign-out", checkAuth, controller.signOut);

router.get("/me", checkAuth, controller.getMe);

export default router;
