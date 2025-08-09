import  { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new AppError(httpStatus.FORBIDDEN, "No Token Received");
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET_TOKEN) as JwtPayload;
    const isUserExist = await User.findOne({ email: verifiedToken.email });

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    };

    if (isUserExist.isActive === IsActive.INACTIVE || isUserExist.isActive === IsActive.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is Deleted");
    }
    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not permitted to view this route!");
    }

    req.user = verifiedToken;
    next();
  } catch (error) {
    next(error);
  }
};