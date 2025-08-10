import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  console.log("checkAuth running...");
  console.log("authRoles:", authRoles);
  console.log("Authorization header:", req.headers.authorization);
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "No Token Received");
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET_TOKEN) as JwtPayload;
    const isUserExist = await User.findOne({ email: verifiedToken.email });

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist.");
    };

    if (isUserExist.isActive === IsActive.INACTIVE || isUserExist.isActive === IsActive.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, `User is account is currently ${isUserExist.isActive}.`);
    }
    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "User account has been deleted and cannot access this resoures.");
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