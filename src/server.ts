/* eslint-disable no-console */
import { Server } from "http";
import { app } from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectDB } from "./app/config/connectDB";


let server: Server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (err) {
    console.log("Server Error Occurred", err);
    process.exit(1);
  }
};

(async () => {
  console.log("⏳ Waiting for connect to server");
  await startServer();
  await seedSuperAdmin();
})();


process.on("SIGINT", () => {
  console.log("SIGINT Signal Received.. Server Shutting Down....");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM Signal Received.. Server Shutting Down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection Error.. Server Shutting Down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Error.. Server Shutting Down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});