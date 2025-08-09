import  { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";


let server: Server;

const func = (): number => {
  const num = 23;
  return num * 3;
};

const startServer = async() => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Database connected");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
    func();
  }
};
(async() => {
  await startServer();
  await seedSuperAdmin();
})();


process.on("unhandledRejection", (err) => {
  console.log("Unhandle Rejecttion Error.. Server Shutting Down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception Error.. Server Shutting Down... ${err}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("SIGTERM", (err) => {
  console.log("SIGTERM Signal Received.. Server Shutting Down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT Signal Received.. Server Shutting Down....");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});