import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

export const OtpSchema = z.object({
    otp: z.string().min(6, { message: "OTP must be 6 characters" }).max(6),
});

export const ProfileSchema = z.object({
    firstName: z.string().min(2, { message: "First name is too short" }),
    lastName: z.string().min(2, { message: "Last name is too short" }),
    phoneNumber: z.string().min(10, { message: "Phone number is invalid" }),
    // Add other profile fields as needed based on the API payload
});

export type LoginExternalInputs = z.infer<typeof LoginSchema>;
export type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;
export type OtpInputs = z.infer<typeof OtpSchema>;
export type ProfileInputs = z.infer<typeof ProfileSchema>;
