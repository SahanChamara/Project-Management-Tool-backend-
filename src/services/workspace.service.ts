import { Roles } from "../enums/role.enum";
import RoleModel from "../models/role-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException } from "../utils/appError";

export const createWorkspaceService = async (
    userId: string,
    body: {
        name: string;
        description?: string | undefined;
    }
) => {
    const { name, description } = body;

    const user = await UserModel.findById(userId);
    if(!user){
        throw new NotFoundException("User Not Found");
    }

    const ownerRole = await RoleModel.findOne({name: Roles.OWNER});
    if(!ownerRole){
        throw new NotFoundException("OWner Role is not Found");
    }

    const workspace = new WorkspaceModel({
        name: name,
        description: description,
        owner: user._id,
    });

    await workspace.save();
}