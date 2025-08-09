import dotenv from "dotenv";
dotenv.config();

interface IEnvConfig {
      PORT: string;
      DB_URL: string;
      NODE_ENV: "development" | "production";
      BCRYPT_SALT_ROUND: string;
      JWT_SECRET_TOKEN: string;
      JWT_SECRET_EXPIRES: string;
      JWT_REFRESH_TOKEN: string;
      JWT_REFRESH_EXPIRES: string;
      SUPER_ADMIN_EMAIL: string;
      SUPER_ADMIN_PASSWORD: string
};

const loadEnvVars = (): IEnvConfig => {
  const requireEnvVars: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUND", "JWT_SECRET_TOKEN", "JWT_SECRET_EXPIRES", "JWT_REFRESH_TOKEN", "JWT_REFRESH_EXPIRES", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"];

  requireEnvVars.forEach(key => {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN as string,
    JWT_SECRET_EXPIRES: process.env.JWT_SECRET_EXPIRES as string,
    JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string
  };
};

export const envVars = loadEnvVars();