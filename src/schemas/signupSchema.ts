import { z } from "zod"

export const validateUsername = z.string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must be no longer than 20 characters")
    .regex(/^[a-zA-Z0-9]*$/, { message: "username must not contain any special characters" })


export const validatePassword = z.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .regex(/^\S*$/, "Password cannot contain spaces")


export const signupSchema = z.object({
    username: validateUsername,
    email: z.string().email("Invalid Email Format"),
    password:validatePassword
})