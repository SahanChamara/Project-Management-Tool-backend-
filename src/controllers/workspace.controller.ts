import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { changeRoleSchema, createWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { changeMemberRoleService, createWorkspaceService, getAllWorkspaceUserIsMemberService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMemberservice } from "../services/workspace.service";
import { HTTPSTATUS } from "../config/http.config";
import { userInfo } from "os";
import { getMemberRoleInworkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";

export const createWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = createWorkspaceSchema.parse(req.body);

        const userId = req.user?._id;
        const { workspace } = await createWorkspaceService(userId, body);

        return res.status(HTTPSTATUS.CREATED).json({
            messaage: "workspace Created Succesfull",
            workspace,
        });
    }
);

export const getAllWorkspacesUserIsMemberController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const workspaces = await getAllWorkspaceUserIsMemberService(userId);

        return res.status(HTTPSTATUS.OK).json({
            message: " User Workspace fetched succesful",
            workspaces,
        });
    }
);

export const getWorkspaceByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        await getMemberRoleInworkspace(userId, workspaceId);

        const { workspace } = await getWorkspaceByIdService(workspaceId);
        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace fetch succesful",
            workspace,
        });
    }
);

export const getWorkspaceMembersController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInworkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { members, roles } = await getWorkspaceMemberservice(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace members retriewd succesfull",
            members,
            roles,
        });
    }
);

export const getWoorkspaceAnalyticsController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInworkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace analytics retriwed success",
            analytics,
        });
    }
);

export const changeWorkspaceMemberRoleController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const { memberId, roleId } = changeRoleSchema.parse(req.body);

        const userId = req.user?._id;

        const { role } = await getMemberRoleInworkspace(userId, workspaceId);
        roleGuard (role, [Permissions.CHANGE_MEMBER_ROLE]);

        const { member } = await changeMemberRoleService(
            workspaceId,
            memberId,
            roleId
          );
      
          return res.status(HTTPSTATUS.OK).json({
            message: "Member Role changed successfully",
            member,
          });

    }
)