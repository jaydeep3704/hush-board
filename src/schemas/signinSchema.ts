import {z} from "zod"

export const signinSchema=z.object({
    username:z.string(),
    password:z.string()
    .min(6,{message:"Password must contain atleast 6 characters"})
    .max(20,{message:"Password mut be no longer than 20 characters"}),
    email:z.string().email("Invalid email format")
})