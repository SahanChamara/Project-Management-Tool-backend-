import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/role-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import TaskModel from "../models/task.model";
import { TaskStatusEnum } from "../enums/task.enum";
import ProjectModel from "../models/project.mode";

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


// get all members in workspace
export const getWorkspaceMemberservice = async (workspaceId: string) => {
    // get all members in the workspace

    const members = await MemberModel.find({ workspaceId, })
        .populate("userId", "name email profilePicture -password")
        .populate("role", "name");

    const roles = await RoleModel.find({}, { name: 1, _id: 1 }).select("-permission").lean();

    return { members, roles };
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
    const currentDate = new Date();

    const totalTask = await TaskModel.countDocuments({
        workspace: workspaceId,
    });

    const overDueTask = await TaskModel.countDocuments({
        workspace: workspaceId,
        dueDate: { $lt: currentDate },
        status: { $ne: TaskStatusEnum.DONE },
    });

    const completedTask = await TaskModel.countDocuments({
        workspace: workspaceId,
        status: TaskStatusEnum.DONE
    });

    const analytics = {
        totalTask,
        overDueTask,
        completedTask,
    };

    return { analytics }
};

export const changeMemberRoleService = async (
    workspaceId: string,
    memberId: string,
    roleId: string,
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace Not Found");
    }

    const role = await RoleModel.findById(roleId);
    if (!role) {
        throw new NotFoundException("role not Found");
    }

    const member = await MemberModel.findOne({
        userId: workspaceId,
        workspaceId: workspaceId,
    });

    if (!member) {
        throw new NotFoundException("Member not found");
    }

    member.role = role;
    await member.save();

    return {
        member,
    };
};

// Update Workspace
export const updateWorkspaceByIdService = async (
    workspaceId: string,
    name: string,
    description?: string,
) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace Not Found");
    }

    //Update workspace Details
    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();

    return {
        workspace,
    };
};

// delete workspace
export const deleteWorkspaceService = async (workspaceId: string, userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const workspace = await WorkspaceModel.findById(workspaceId).session(
            session
        );
        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }

        // user owns the workspce chekiing
        if (workspace.owner.toString() !== userId) {
            throw new BadRequestException(
                "You are not authorized to delete this workspace"
            );
        }

        const user = await UserModel.findById(userId).session(session);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        await ProjectModel.deleteMany({ workspace: workspace._id }).session(
            session
        );
        await TaskModel.deleteMany({ workspace: workspace._id }).session(session);

        await MemberModel.deleteMany({
            workspaceId: workspace._id,
        }).session(session);

        // update user workspace it match the deleted workspace
        if (user?.currentWorkspace?.equals(workspaceId)) {
            const memberWorkspace = await MemberModel.findOne({ userId }).session(
                session
            );
            // Update the users currentWorkspace
            user.currentWorkspace = memberWorkspace
                ? memberWorkspace.workspaceId
                : null;

            await user.save({ session });
        }

        await workspace.deleteOne({ session });

        await session.commitTransaction();

        session.endSession();

        return {
            currentWorkspace: user.currentWorkspace,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

}