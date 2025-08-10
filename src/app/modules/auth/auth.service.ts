/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelper/AppError";
import { envVars } from "../../config/env";
import httpStatus from "http-status-codes";


const getNewAccessToken = async (refreshToken: string) => {
      const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
      return { accessToken: newAccessToken };
};

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
      const user = await User.findById(decodedToken.userId);
      const isPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);
      if (!isPasswordMatch) {
            throw new AppError(httpStatus.NOT_FOUND, "Old password doesn't exist.");
      }

      user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
      user!.save();
      return true;
};


export const AuthService = {
      getNewAccessToken,
      resetPassword
};