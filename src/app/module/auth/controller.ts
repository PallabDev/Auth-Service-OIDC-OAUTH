import { type Request, type Response } from 'express';
import { signinService, signupService } from './services.js';
import ApiError from '../../common/utils/ApiError.js';
import ApiResponse from '../../common/utils/ApiResponse.js';
import { userLogin, userSignup } from './validate.js';


export const signup = async (req: Request, res: Response) => {
    const result = await userSignup.safeParseAsync(req.body);
    if (!result.success) {
        console.log(result.error)
        throw new ApiError(400, "Validation Error");
    }
    const { name, email, password } = result.data;
    const response = await signupService(email, name, password);
    if (!response) {
        throw new ApiError(500, "User registration failed");
    }
    return new ApiResponse(res, 201, "User created successfully", response);
}

export const signin = async (req: Request, res: Response) => {
    const result = await userLogin.safeParseAsync(req.body);
    if (!result.success) {
        console.log(result.error)
        throw new ApiError(400, "Validation Error");
    }
    const { email, password } = result.data;
    const response = await signinService(email, password);
    if (!response) {
        throw new ApiError(401, "User Login failed");
    }
    return new ApiResponse(res, 200, "User Login successfully", response);
}