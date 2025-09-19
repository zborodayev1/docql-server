export const PORT = process.env.PORT || 3000;

export const SALT_ROUNDS = process.env.SALT_ROUNDS | 1;

export const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET || "12345";
export const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET || "12345";

export const NODE_ENV = process.env.NODE_ENV || "production";

export const EXPIRE_TIME = process.env.EXPIRE_TIME;
