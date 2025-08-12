import { RideService } from './ride.service';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";


const requestRide = catchAsync(async (req: Request, res: Response) => {
      const ride = await RideService.requestRide(req.body);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Ride requested successfully.",
            data: ride
      });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
      const result = await RideService.getAllRides();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All rides retrived successfully.",
            data: result.data,
            meta: result.meta
      });
});


export const RideController = {
      requestRide,
      getAllRides
};