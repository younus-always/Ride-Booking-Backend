import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.string({ error: "Name is required" })
    .min(3, { error: "Name must be 3 characters" })
    .max(50, { error: "Name must shorter than 50 characters" }),
  email: z.string({ error: "Email is required" }),
  password: z.string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter."
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character."
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number."
    })
});

export const updateUserZodSchema = z.object({
  name: z.string({ error: "Name is required" })
    .min(3, { error: "Name must be 3 characters" })
    .max(50, { error: "Name must shorter than 50 characters" })
    .optional(),
  password: z.string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter."
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character."
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number."
    })
    .optional(),
  role: z.enum(Object.values(Role)).optional(),
  isActive: z.enum(Object.values(IsActive)).optional(),
  isVerified: z.boolean({ error: "isVerified must be true of false" }).optional(),
  isDeleted: z.boolean({ error: "isDeleted must be true of false" }).optional()
});
