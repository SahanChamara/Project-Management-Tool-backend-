import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/role-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException } from "../utils/appError";

// Create NEW Workspace
export const createWorkspaceService = async (
    userId: string,
    body: {
        name: string;
        description?: string | undefined;
    }
) => {
    const { name, description } = body;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log("session strar...");

        const user = await UserModel.findById(userId).session(session);
        if (!user) {
            throw new NotFoundException("User Not Found");
        }

        const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(session);
        if (!ownerRole) {
            throw new NotFoundException("OWner Role is not Found");
        }

        const workspace = new WorkspaceModel({
            name: name,
            description: description,
            owner: user._id,
        });
        await workspace.save({ session });

        const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        });
        await member.save({ session });

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();
        console.log("session end");

        return {
            workspace,
        };
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getAllWorkspaceUserIsMemberService = async (userId: string) => {
    const memberships = await MemberModel.find({ userId })
        .populate("workspaceId")
        .select("-password")
        .exec();

    //get the workspacedetails from memberships
    const workspaces = memberships.map((membership) => membership.workspaceId);
    return { workspaces };
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace not Found");
    }

    const members = await MemberModel.find({ workspaceId, }).populate("role");

    const workspaceWithMembers = {
        ...workspace.toObject(),
        members,
    };

    return {
        workspace: workspaceWithMembers,
    };
};