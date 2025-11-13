import z from "zod";
import { VehicleType } from "./driver.interface";

export const vehicleInfoZodSchema = z.object({
      vehicleType: z.enum(VehicleType),
      brand: z.string().min(2, "Brand name is required"),
      model: z.string().min(1, "Model name is required"),
      color: z.string().min(1, "Color is required"),
      image: z.url("Image must be a valid url"),
      vehicleNumber: z.string().min(3, "Vehicle number is required"),
      plateNumber: z.string().min(3, "Plate number is required"),
      licenseNumber: z.string().min(5, "License number is required"),
      year: z
            .number()
            .min(1990)
            .max(new Date().getFullYear())
            .optional()
});

export const driverZodSchema = z.object({
      vehicleInfo: vehicleInfoZodSchema,
      isOnline: z.boolean().optional()
});