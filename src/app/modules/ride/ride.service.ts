import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import { ChangedBy, IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import httpStatus from "http-status-codes";


const requestRide = async (payload: Partial<IRide>, decodedToken: JwtPayload) => {
      const rider = await User.findOne({ _id: decodedToken.userId });
      if (!rider) {
            throw new AppError(httpStatus.NOT_FOUND, "Rider not found");
      }

      if (payload.riderId !== decodedToken.userId) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid rider id");
      }

      const existingRide = await Ride.findOne({
            riderId: rider._id,
            status: { $in: ["requested", "accepted", "picked_up", "in_transit"] }
      });

      if (existingRide) {
            throw new Error("You already have an active ride.");
      }

      const ride = await Ride.create(payload);
      return ride;
};

const getAllRides = async () => {
      const rides = await Ride.find({});
      const total = await Ride.countDocuments();

      return {
            data: rides,
            meta: { total }
      };
};

const cancelRide = async (rideId: string, note: string) => {
      const ride = await Ride.findById(rideId);
      if (!ride) {
            throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
      }

      // cancellation after certain statuses
      const nonCancellableStatuses = ["accepted", "picked_up", "in_transit", "completed"];
      if (nonCancellableStatuses.includes(ride.status)) {
            throw new AppError(httpStatus.FORBIDDEN, "You cannot cancel this ride.");
      };
      if (ride.status === RideStatus.Cancelled) {
            throw new AppError(httpStatus.BAD_REQUEST, "Already cancelled this ride.");
      };

      // update ride status payload
      const updatedPayload = {
            status: RideStatus.Cancelled,
            statusHistory: [...ride.statusHistory, {
                  status: RideStatus.Cancelled,
                  changedBy: ChangedBy.Rider,
                  changedById: ride.riderId,
                  note: note
            }]
      };

      const cancelledRide = await Ride.findByIdAndUpdate(rideId, updatedPayload, { new: true });
      return cancelledRide;
};

const updateRideStatus = async (rideId: string) => {
      console.log(rideId);
      return {};
};


export const RideService = {
      requestRide,
      getAllRides,
      cancelRide,
      updateRideStatus
};