export class AppError extends Error {
  status;
  constructor(message, status, name = "AppError") {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation Error") {
    super(message, 400, "ValidationError");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404, "NotFoundError");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UnauthorizedError");
  }
}
