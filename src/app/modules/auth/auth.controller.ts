/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { clearAuthCookie } from "../../utils/clearCookie";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { createUserTokens } from "../../utils/userTokens";
import AppError from "../../errorHelper/AppError";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";


const creadentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      // const loginInfo = await AuthService.creadentialsLogin(req.body);

      // setAuthCookie(res, loginInfo);
      // sendResponse(res, {
      //       statusCode: httpStatus.OK,
      //       success: true,
      //       message: "User logged in successfully.",
      //       data: loginInfo
      // });

      passport.authenticate("local", async (err: any, user: any, info: any) => {
            if (err) {
                  return next(err);
            };
            if (!user) {
                  return next(new AppError(400, info.message));
            };

            const userTokens = createUserTokens(user);
            setAuthCookie(res, userTokens);

            const { password, ...data } = user.toObject();

            sendResponse(res, {
                  success: true,
                  statusCode: httpStatus.OK,
                  message: "User logged in successfully.",
                  data: {
                        accessToken: userTokens.accessToken,
                        refreshToken: userTokens.refreshToken,
                        user: data
                  }
            });
      })(req, res, next);
});

const logOut = catchAsync(async (req: Request, res: Response) => {
      clearAuthCookie(res, "accessToken");
      clearAuthCookie(res, "refreshToken");

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged out successfully.",
            data: null
      });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
      const { refreshToken } = req.cookies;
      const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

      setAuthCookie(res, tokenInfo);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "New access token created successfully.",
            data: tokenInfo
      });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
      const { oldPassword, newPassword } = req.body;
      const decodedToken = req.user as JwtPayload;

      const updatedPassword = await AuthService.resetPassword(oldPassword, newPassword, decodedToken);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password changed successfully.",
            data: updatedPassword
      });
});


export const AuthController = {
      creadentialsLogin,
      logOut,
      getNewAccessToken,
      resetPassword
};