import { Request, Response } from "express";
import express from "express";
import { router } from "./app/routes";
import cors from "cors";
import cookiParser from "cookie-parser";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import "./app/config/passport";

export const app = express();

// Middlewares
// PassportJS
app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookiParser());
app.use(cors());

// Route
app.use("/api/v1", router);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Ride Booking Backend API",
    timestamp: new Date().toISOString()
  });
});


app.use(globalErrorHandler);
app.use(notFound);