/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { createUserTokens } from "../../utils/userTokens";


const creadentialsLogin = async (payload: Partial<IUser>) => {
      const { email, password } = payload
      const isUserExist = await User.findOne({ email })

      if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist")
      }
      const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)
      if (!isPasswordMatch) {
            throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password")
      }

      const userTokens = createUserTokens(isUserExist)
      const { password: pass, ...data } = isUserExist.toObject()

      return {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: data
      }
};


export const AuthService = {
      creadentialsLogin
};