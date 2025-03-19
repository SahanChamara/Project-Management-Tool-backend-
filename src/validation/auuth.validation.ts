import { z } from "zod";

export const emailSchema = z.string()
    .trim()
    .email("Email is Invalid...Enter Valid Email")
    .min(1)
    .max(255);

export const passwordSchema = z.string()
    .trim()
    .min(5)
    .max(20);

export const registerSchema = z.object({
    name: z.string().trim().min(1).max(255),
    email: emailSchema,
    password: passwordSchema,
});