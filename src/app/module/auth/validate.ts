import { z } from "zod"

export const userSignup = z.object({
    name: z.string().min(5).max(100),
    email: z.string().min(5).max(322),
    password: z.string().min(5).max(64)
});

export const userLogin = z.object({
    email: z.string().min(15).max(322),
    password: z.string().min(5).max(64)
})