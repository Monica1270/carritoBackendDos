
import dotenv from "dotenv";

dotenv.config();

export const config = {
  general: {
    PORT: Number(process.env.PORT) || 8080,
    SECRET: process.env.SECRET || "1234",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || process.env.SECRET || "coderSecret",

  },
  database: {
    MONGO_URI: process.env.MONGO_URI || "",
    DB_NAME: process.env.DB_NAME || "",
  },
};