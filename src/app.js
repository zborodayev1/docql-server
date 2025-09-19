import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv-safe";
import express from "express";
import path from "path";
import { PrismaClient } from "../prisma/src/generated/prisma/index.js";
import * as env from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRouter from "./routes/auth.router.js";
import documentRouter from "./routes/document.router.js";
import templatesRouter from "./routes/templates.router.js";
import { logger } from "./utils/logger.js";
import { WorkerPool } from "./worker-pool.js";

dotenv.config({
  allowEmptyValues: false,
});

export const {
  DATABASE_URL,
  REFRESH_JWT_SECRET,
  ACCESS_JWT_SECRET,
  SALT_ROUNDS,
  NODE_ENV,
  GENERATED_DIR,
  EXPIRE_TIME,
} = process.env;

const app = express();

export const prisma = new PrismaClient();

export const pool = new WorkerPool(
  path.join(path.join(process.cwd(), "src", "workers", "pdfWorker.js")),
  4,
);

const allowedOrigins = ["http://localhost:4000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/templates", templatesRouter);
app.use("/api/auth", authRouter);
app.use("/api/document", documentRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT}`);
});
