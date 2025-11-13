import z from "zod";
import { RideStatus } from "./ride.interface";


export const locationSchema = z.object({
      lat: z.number({ error: "Latitude is required" }).min(-90).max(90),
      lng: z.number({ error: "Longitude is required" }).min(-180).max(180),
      address: z.string().optional()
});

export const createRideZodSchema = z.object({
      riderId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid riderId"),
      pickup: locationSchema,
      destination: locationSchema,
      fare: z
            .number({ error: "Fare amount is required" })
            .min(80, { error: "Minimum fare amount 80 BDT." })
});

export const updateRideStatusZodSchema = z.object({
      status: z.enum(Object.values(RideStatus))
});