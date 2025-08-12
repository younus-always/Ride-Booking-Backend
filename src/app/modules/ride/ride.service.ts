import { IRide } from "./ride.interface";
import { Ride } from "./ride.model";

const requestRide = async (payload: Partial<IRide>) => {
      const ride = await Ride.create(payload);
      return ride;
};

const getAllRides = async () => {
      const rides = await Ride.find();
      const total = await Ride.countDocuments();

      return {
            data: rides,
            meta: { total }
      };
};


export const RideService = {
      requestRide,
      getAllRides
};