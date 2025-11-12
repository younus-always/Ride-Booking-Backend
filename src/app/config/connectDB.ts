import mongoose from "mongoose";
import { envVars } from "./env";

export const connectDB = async () => {
      try {
            await mongoose.connect(envVars.DB_URL);
            console.log("✅ MongoDB Connected");
      } catch (err) {
            console.log("❌ MongoDB Connection Error:", err);
            process.exit(1);
      }
};