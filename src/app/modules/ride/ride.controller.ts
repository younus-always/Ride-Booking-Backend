import { RideService } from "./ride.service";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";


const requestRide = catchAsync(async (req: Request, res: Response) => {
      const decodedToken = req.user as JwtPayload;
      const result = await RideService.requestRide(req.body, decodedToken);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Ride requested successfully.",
            data: result
      });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
      const result = await RideService.getAllRides();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All rides retrieved successfully.",
            data: result.data,
            meta: result.meta
      });
});

const cancelRide = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { note } = req.body;
      const result = await RideService.cancelRide(id, note);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Ride cancelled successfully.",
            data: result
      });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await RideService.updateRideStatus(id);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Ride status updated successfully.",
            data: result
      });
});


export const RideController = {
      requestRide,
      getAllRides,
      cancelRide,
      updateRideStatus
};