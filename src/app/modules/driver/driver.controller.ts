import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DriverService } from "./driver.service";
import { JwtPayload } from "jsonwebtoken";

const applyDriver = catchAsync(async (req: Request, res: Response) => {
      const decodedToken = req.user as JwtPayload;
      const result = await DriverService.applyDriver(decodedToken.userId, req.body);

      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Apply as a driver successfully",
            data: result
      });
});

const approveDriver = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await DriverService.approveDriver(id);

      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Driver approved successfully",
            data: result
      });
});


export const DriverController = {
      applyDriver,
      approveDriver
};