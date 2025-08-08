import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: AsyncHandler) => {
      return (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch((err) => {
                  if (envVars.NODE_ENV === "development") {
                        console.log("Try-Catch Error handler:", err)
                  }
                  next(err)
            })
      }
};