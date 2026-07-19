import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../config.env") });

export const config = {
  port: process.env.PORT_NUMBER || 5000,
  connString: process.env.CONN_STRING || "mongodb://localhost:27017/rafeeq",
  secretKey: process.env.SECRET_KEY || "rafeeq_dev_secret_change_me",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
};
