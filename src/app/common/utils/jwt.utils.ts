import { eq } from "drizzle-orm"
import { db } from "../../../db/config.js"
import { users } from "../../../db/schema.js"
import ApiError from "./ApiError.js"
import jwt, { type SignOptions } from "jsonwebtoken"

export const generateTokens = async (userId: number) => {
    try {
        const user = await db.select().from(users).where(eq(users.id, userId))

        if (!user || user.length === 0) {
            throw new ApiError(404, "User not found")
        }

        const currentUser = user[0]!

        const accessSecret = process.env.ACCESS_TOKEN_SECRET
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET

        if (!accessSecret || !refreshSecret) {
            throw new ApiError(500, "JWT secrets are not defined")
        }

        const accessExpiry = process.env.ACCESS_TOKEN_EXPIRY ?? "15m"
        const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY ?? "7d"

        const accessToken = jwt.sign(
            {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name
            },
            accessSecret,
            { expiresIn: accessExpiry } as SignOptions
        )

        const refreshToken = jwt.sign(
            {
                id: currentUser.id
            },
            refreshSecret,
            { expiresIn: refreshExpiry } as SignOptions
        )

        await db
            .update(users)
            .set({ refreshToken })
            .where(eq(users.id, userId))

        return { accessToken, refreshToken }

    } catch (error: unknown) {
        console.error(error)

        if (error instanceof ApiError) {
            throw error
        }

        throw new ApiError(
            500,
            "Something went wrong while generating tokens"
        )
    }
}