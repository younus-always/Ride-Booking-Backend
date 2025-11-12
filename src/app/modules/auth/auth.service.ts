/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelper/AppError";
import { envVars } from "../../config/env";
import httpStatus from "http-status-codes";
import { IAuthProvider, IsActive } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";


const getNewAccessToken = async (refreshToken: string) => {
      const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
      return { accessToken: newAccessToken };
};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
      const user = await User.findById(decodedToken.userId);
      const isPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);
      if (!isPasswordMatch) {
            throw new AppError(httpStatus.NOT_FOUND, "Old password doesn't exist.");
      }

      user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
      user!.save();
};

const forgetPassword = async (email: string) => {
      const user = await User.findOne({ email });

      if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
      }
      if (!user.isVerified) {
            throw new AppError(httpStatus.FORBIDDEN, "User is not verified");
      }
      if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${user.isActive}`);
      }
      if (user.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      const jwtPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
      };
      const resetToken = jwt.sign(jwtPayload, envVars.JWT_SECRET_TOKEN, { expiresIn: "10m" });
      const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;

      sendEmail({
            to: user.email,
            subject: "Password Reset",
            templateName: "forgetPassword",
            templateData: {
                  name: user.name,
                  resetUILink
            }
      });
};


const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
      if (payload.id !== decodedToken.userId) {
            throw new AppError(httpStatus.FORBIDDEN, "Something went wrong. You cannot reset your password.");
      }

      const user = await User.findById(decodedToken.userId);
      const hashedPassword = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND));

      user!.password = hashedPassword;
      await user?.save();
};

const setPassword = async (userId: string, password: string) => {
      const user = await User.findById(userId);

      if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      const googleLogin = user.auths.some(providerObj => providerObj.provider === "google");

      if (user.password && !googleLogin) {
            throw new AppError(httpStatus.BAD_REQUEST, "You have already password. If you want to set new password then go to change-password endpoints.");
      }

      if (user.password && googleLogin) {
            throw new AppError(httpStatus.BAD_REQUEST, "You have already set your password. Now you can change the password from your profile password update.");
      };

      const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

      const credentialProvider: IAuthProvider = {
            provider: "credential",
            providerId: user.email
      };
      const auths = [...user.auths, credentialProvider];

      user.password = hashedPassword;
      user.auths = auths;
      await user.save();
};


export const AuthService = {
      getNewAccessToken,
      changePassword,
      forgetPassword,
      resetPassword,
      setPassword
};