import mongoose, { mongo } from "mongoose";
import UserModel from "../models/user.mode";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/role-permission.model";
import { Roles } from "../enums/role.enum";
import { BadRequestException, NotFoundException } from "../utils/appError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/account-provider.enum";

export const loginOrCreateAccountService = async (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
}) => {
    const { providerId, provider, displayName, email, picture } = data;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log("session is start");

        let user = await UserModel.findOne({ email }).session(session);
        if (!user) {
            // if user dosnt found create new user
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture ?? null,
            });
            await user.save({ session });

            const account = new AccountModel({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            });
            await account.save({ session });

            // create new workspace for a new user
            const workspace = new WorkspaceModel({
                name: `My Workspace`,
                description: `workspace created for ${user.name}`,
                owner: user._id,
            });
            await workspace.save({ session });

            const ownerRole = await RoleModel.findOne({
                name: Roles.OWNER,
            }).session(session);

            if (!ownerRole) {
                throw new NotFoundException("Owner Role is not found");
            }

            const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });
            await member.save({ session });

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });
        }
        await session.commitTransaction();
        session.endSession();
        console.log("session end...");

        return { user };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
};


export const registerUserService = async (body: {
    name: string;
    email: string;
    password: string;
}) => {
    const { name, email, password } = body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const existingUser = await UserModel.findOne({ email }).session(session);

        if (existingUser) {
            throw new BadRequestException("User Already Exist...");
        }

        const user = new UserModel({
            name: name,
            email: email,
            password: password,
        })
        await user.save({ session });


        // create a new acoount for a new user
        const account = new AccountModel({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: user.email,
        })
        await account.save({ session });

        // create new workspace for a new user
        const workspace = new WorkspaceModel({
            name: `My Workspace`,
            description: `Workspace create for a user ${user.name}`,
            owner: user._id,
        });
        await workspace.save({ session });

        const ownerRole = await RoleModel.findOne({
            name: Roles.OWNER,
        }).session(session);

        if (!ownerRole) {
            throw new NotFoundException("Owner Rola has Not Found");
        }

        const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        })
        await member.save({ session });

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session });

        session.commitTransaction();
        session.endSession();
        console.log("session end...");

        return {
            userId: user._id,
            workspaceId: workspace._id,
        };

    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }
};

