import dotenv from "dotenv";
dotenv.config();

interface IEnvConfig {
      PORT: string;
      DB_URL: string;
      NODE_ENV: "development" | "production",
      BCRYPT_SALT_ROUND: string
};

const loadEnvVars = (): IEnvConfig => {
      const requireEnvVars: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUND"];

      requireEnvVars.forEach(key => {
            if (!process.env[key]) {
                  throw new Error(`Missing environment variable ${key}`)
            }
      });

      return {
            PORT: process.env.PORT as string,
            DB_URL: process.env.DB_URL as string,
            NODE_ENV: process.env.NODE_ENV as "development" | "production",
            BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string
      }

};

export const envVars = loadEnvVars();