import { config } from "dotenv";

config();

// Exporto las variables de entorno

export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
export const PORT = 8080;
export const NODEMAILER_USER = process.env.NODEMAILER_USER;
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
export const ENVIRONMENT = process.env.ENVIRONMENT
