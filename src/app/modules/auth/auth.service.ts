/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";


const creadentialsLogin = async (payload: Partial<IUser>) => {
      const { email, password } = payload;
      const isUserExist = await User.findOne({ email });

      if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
      }
      const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string);
      if (!isPasswordMatch) {
            throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
      }

      const userTokens = createUserTokens(isUserExist);
      const { password: pass, ...data } = isUserExist.toObject();

      return {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: data
      };
};

const getNewAccessToken = async (refreshToken: string) => {
      const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
      return { accessToken: newAccessToken };
};

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
      console.log({ oldPassword, newPassword, decodedToken });
      // const user = await User.findById(decodedToken.userId);
      // console.log(user);

      return null;
};


export const AuthService = {
      creadentialsLogin,
      getNewAccessToken,
      resetPassword
};