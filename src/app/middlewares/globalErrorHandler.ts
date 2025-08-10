import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";
import AppError from "../errorHelper/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { TErrrorSources } from "../interfaces/error.type";
import { handleValidationError } from "../helpers/handleValidationError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Global Error Handler:", err);
  }

  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errorSources: TErrrorSources[] = [];

  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrrorSources[];
  } else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message;
  };

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null
  });
};