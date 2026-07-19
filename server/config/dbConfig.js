import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.connString);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error(`MongoDB runtime error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  });
};
