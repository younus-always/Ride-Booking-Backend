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
import { envVars } from "../../config/env";


const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("local", async (err: any, user: any, info: any) => {
            if (err) {
                  return next(err);
            };
            if (!user) {
                  return next(new AppError(httpStatus.NOT_FOUND, info.message));
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

const googleCallbackController = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      let redirectTo = req.query.state ? req.query.state as string : "";

      if (redirectTo.startsWith("/")) {
            redirectTo = redirectTo.slice(1);
      };
      if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found.");
      };
      const tokenInfo = createUserTokens(user);
      setAuthCookie(res, tokenInfo);

      res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
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

const changePassword = catchAsync(async (req: Request, res: Response) => {
      const { oldPassword, newPassword } = req.body;
      const decodedToken = req.user as JwtPayload;
      await AuthService.changePassword(oldPassword, newPassword, decodedToken);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password changed successfully.",
            data: null
      });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
      const { email } = req.body;
      await AuthService.forgetPassword(email);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Email sent successfully.",
            data: null
      });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
      const decodedToken = req.user as JwtPayload;
      await AuthService.resetPassword(req.body, decodedToken);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password reset successfully.",
            data: null
      });
});

const setPassword = catchAsync(async (req: Request, res: Response) => {
      const { password } = req.body;
      const decodedToken = req.user as JwtPayload;
      await AuthService.setPassword(decodedToken.userId, password);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password set successfully.",
            data: null
      });
});


export const AuthController = {
      credentialLogin,
      googleCallbackController,
      logOut,
      getNewAccessToken,
      changePassword,
      forgetPassword,
      resetPassword,
      setPassword
};