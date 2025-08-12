import z from "zod";
import { RideStatus } from "./ride.interface";

export const createRideZodSchema = z.object({
      riderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid riderId"),
      pickup: z.object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
            address: z.string().optional()
      }),
      destination: z.object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
            address: z.string().optional()
      }),
      fare: z.number().min(50, { error: "Minimum fare amount 50 BDT." }),
      status: z.enum(Object.values(RideStatus)).default(RideStatus.Requested)
});