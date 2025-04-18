import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getCurrentUserService } from "../services/user.service";
import { HTTPSTATUS } from "../config/http.config";

export const getCurrentUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        console.log(userId);        

        const {user} = await getCurrentUserService(userId);
        return res.status(HTTPSTATUS.OK).json({
            message: "User Fetch Succesfull",
            user,
        });
    }
)