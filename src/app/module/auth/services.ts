import { eq } from "drizzle-orm";
import { db } from "../../../db/config.js";
import { users } from "../../../db/schema.js";
import ApiError from "../../common/utils/ApiError.js"
import bcrypt from "bcryptjs";
import { generateTokens } from "../../common/utils/jwt.utils.js";

const sanitizeUser = (user: any) => {
    if (!user) return null

    const userObj = typeof user.toObject === "function" ? user.toObject() : { ...user }
    delete userObj.passwordHash
    delete userObj.emailToken
    delete userObj.passwordToken
    delete userObj.refreshToken
    return userObj
}

export const signupService = async (email: string, name: string, password: string) => {
    if (!email || !name || !password) {
        throw new ApiError(400, "Bad Request");
    }
    const existingUser = await db.select().from(users).where(eq(users.email, email))
    console.log(existingUser)
    if (existingUser.length > 0) {
        throw new ApiError(409, "User already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await db.insert(users).values({
        name,
        email,
        passwordHash: hashPassword
    }).returning();

    if (!user) {
        throw new ApiError(500, "User Registration Failed");
    }
    // Send email to the user so that they can verify there email

    return sanitizeUser(user[0]);
}

export const signinService = async (email: string, password: string) => {
    if (!email || !password) {
        throw new ApiError(401, "Invalid Credential, Credential Required");
    }
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length < 1) {
        throw new ApiError(409, "User Not Found");
    }
    if (!bcrypt.compare(password, user[0]!.passwordHash)) {
        throw new ApiError(401, "Invalid Credential!");
    }
    const { accessToken, refreshToken } = await generateTokens(user[0]!.id)

    const safeUser = sanitizeUser(user[0])
    return {
        accessToken,
        refreshToken,
        user: safeUser
    }
}