import  { Request, Response } from "express";
import express from "express";
import { router } from "./app/routes";
import cors from "cors";
import cookiParser from "cookie-parser";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

export const app = express();

app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use("/api/v1", router);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Ride Booking Backend API" });
});


app.use(globalErrorHandler);
app.use(notFound);