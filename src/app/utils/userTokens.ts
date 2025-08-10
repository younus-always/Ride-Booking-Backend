import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelper/AppError";
import httpStatus from "http-status-codes";

export const createUserTokens = (payload: Partial<IUser>) => {
  const jwtPayload = {
    userId: payload._id,
    email: payload.email,
    role: payload.role
  };

  const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET_TOKEN, envVars.JWT_SECRET_EXPIRES);
  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_TOKEN, envVars.JWT_REFRESH_EXPIRES);

  return {
    accessToken,
    refreshToken
  };
};


export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN) as JwtPayload;
  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exists.");
  } else if (isUserExist.isActive === IsActive.INACTIVE) {
    throw new AppError(httpStatus.FORBIDDEN, "User account is inactive.");
  } else if (isUserExist.isActive === IsActive.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "User account is blocked.");
  } else if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User account has been deleted.");
  };

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  };

  const newToken = generateToken(jwtPayload, envVars.JWT_SECRET_TOKEN, envVars.JWT_SECRET_EXPIRES);

  return newToken;
};