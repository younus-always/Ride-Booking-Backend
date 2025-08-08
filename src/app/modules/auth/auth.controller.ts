import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";

const creadentialsLogin = catchAsync(async (req: Request, res: Response) => {
      const loginInfo = await AuthService.creadentialsLogin(req.body)

      setAuthCookie(res, loginInfo)

      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User Logged In Successful",
            data: loginInfo
      })
});

export const AuthController = {
      creadentialsLogin
}