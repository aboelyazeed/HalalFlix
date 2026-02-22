import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "3000", 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/halalflix",
  jwtSecret: process.env.JWT_SECRET || "halalflix-dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
