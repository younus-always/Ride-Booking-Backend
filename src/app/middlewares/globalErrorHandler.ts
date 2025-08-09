import  { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";
import AppError from "../errorHelper/AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Global Error Handler:", err);
  }

  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null
  });
};