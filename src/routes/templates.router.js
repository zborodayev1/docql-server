import express from "express";
import * as controller from "../controllers/templates.controller.js";
import { checkAuth } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", checkAuth, controller.getAll);

router.get("/:id", checkAuth, controller.getById);

router.post("/", controller.create);

router.patch("/:id", controller.update);

router.delete("/:id", controller.deleteById);

export default router;
