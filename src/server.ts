import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { envVars } from "./app/config/env";


let server: Server;

const startServer = async () => {
      try {
            await mongoose.connect(envVars.DB_URL)
            console.log("Database connected")

            server = app.listen(envVars.PORT, () => {
                  console.log(`Server is running on port ${envVars.PORT}`)
            })
      } catch (error) {
            console.log(error)
      }
};
startServer()


process.on("unhandledRejection", (err) => {
      console.log("Unhandle Rejecttion Error.. Server Shutting Down...", err)
      if (server) {
            server.close(() => {
                  process.exit(1)
            })
      }
});

process.on("uncaughtException", (err) => {
      console.log(`Uncaught Exception Error.. Server Shutting Down... ${err}`)
      if (server) {
            server.close(() => {
                  process.exit(1)
            })
      }
});

process.on("SIGTERM", (err) => {
      console.log("SIGTERM Signal Received.. Server Shutting Down...", err)
      if (server) {
            server.close(() => {
                  process.exit(1)
            })
      }
});

process.on("SIGINT", () => {
      console.log("SIGINT Signal Received.. Server Shutting Down....")
      if (server) {
            server.close(() => {
                  process.exit(1)
            })
      }
});