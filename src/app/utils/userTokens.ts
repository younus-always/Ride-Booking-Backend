import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

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
      }
};