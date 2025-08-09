import {  Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { clearAuthCookie } from "../../utils/clearCookie";
import { JwtPayload } from "jsonwebtoken";

const creadentialsLogin = catchAsync(async (req: Request, res: Response) => {
      const loginInfo = await AuthService.creadentialsLogin(req.body);

      setAuthCookie(res, loginInfo);

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User Logged In Successful",
            data: loginInfo
      });
});

const logOut = catchAsync(async (req: Request, res: Response) => {
      clearAuthCookie(res, "accessToken");
      clearAuthCookie(res, "refreshToken");

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logout successfull",
            data: null
      });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
      const { refreshToken } = req.cookies;
      const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

      setAuthCookie(res, tokenInfo);

      sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "New access token created successfully",
            data: tokenInfo
      });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
      const { oldPassword, newPassword } = req.body;
      const decodedToken = req.user as JwtPayload;
      const updatedPassword = await AuthService.resetPassword(oldPassword, newPassword, decodedToken);

      console.log(req);
      console.log(req.user);
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password changed successfully",
            data: updatedPassword
      });
});


export const AuthController = {
      creadentialsLogin,
      logOut,
      getNewAccessToken,
      resetPassword
};