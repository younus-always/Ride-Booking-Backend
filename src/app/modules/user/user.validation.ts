import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.string({ error: "Name is required" })
    .min(3, { error: "Name must be 3 characters" })
    .max(50, { error: "Name must shorter than 50 characters" }),
  email: z.email().toLowerCase(),
  password: z.string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long." })
    .max(14, { error: "Password cannot exceed 14 characters." })
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter."
    })
    .regex(/^(?=.*[a-z])/, {
      error: "Password must contain at least 1 lowercase letter."
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character (!@#$%^&*)."
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number."
    }),
  phone: z
    .string({ error: "Phone number must be string." })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/,
      { error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX" })
    .optional(),
  address: z
    .string({ error: "Address must be string." })
    .max(200, { error: "Address cannot exceed 200 characters." })
    .optional()
});

export const updateUserZodSchema = z.object({
  name: z.string({ error: "Name is required" })
    .min(3, { error: "Name must be 3 characters" })
    .max(50, { error: "Name must shorter than 50 characters" })
    .optional(),
  phone: z.
    string({ error: "Phone number must be string." })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/,
      { error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX" })
    .optional(),
  address: z
    .string({ error: "Address must be string." })
    .max(200, { error: "Address cannot exceed 200 characters." })
    .optional(),
  role: z
    .enum(Object.values(Role) as [string])
    .optional(),
  isActive: z
    .enum(Object.values(IsActive) as [string])
    .optional(),
  isVerified: z
    .boolean({ error: "isVerified must be true of false" })
    .optional(),
  isDeleted: z
    .boolean({ error: "isDeleted must be true of false" })
    .optional()
});
