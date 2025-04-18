import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/appError";

export const getCurrentUserService = async (userId: string) => {
    console.log(userId);

    const user = await UserModel.findById(userId)
        .populate("currentWorkspace")
        .select("-password");

    if (!user) {
        throw new BadRequestException("User Not Found");
    }

    return { user, };
}