import z from "zod";

export const resetPasswordSchema = z.object({
    id: z.string(),
    newPassword: z
        .string({ error: "Password must is required" })
        .min(8, { error: "Password must be at least 8 characters long." })
        .max(14, { error: "Password cannot exceed  14 characters." })
        .regex(/^(?=.*[A-Z])/, {
            error: "Password must contain at least 1 uppercase letter."
        })
        .regex(/^(?=.*[a-z])/, {
            error: "Password must contain at least 1 lowercase letter."
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            error: "Password must contain at least 1 special character."
        })
        .regex(/^(?=.*\d)/, {
            error: "Password must contain at least 1 number."
        })
});

export const setPasswordSchema = z.object({
    password: z
        .string({ error: "Password must is required" })
        .min(8, { error: "Password must be at least 8 characters long." })
        .max(14, { error: "Password cannot exceed  14 characters." })
        .regex(/^(?=.*[A-Z])/, {
            error: "Password must contain at least 1 uppercase letter."
        })
        .regex(/^(?=.*[a-z])/, {
            error: "Password must contain at least 1 lowercase letter."
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            error: "Password must contain at least 1 special character."
        })
        .regex(/^(?=.*\d)/, {
            error: "Password must contain at least 1 number."
        })
});