import { AppError } from "../errors-class.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
    });
  }

  return res.status(500).json({
    error: "InternalServerError",
    message: "Something went wrong",
  });
};
