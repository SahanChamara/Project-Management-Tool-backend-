import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { createWorkspaceService, getAllWorkspaceUserIsMemberService, getWorkspaceByIdService } from "../services/workspace.service";
import { HTTPSTATUS } from "../config/http.config";
import { userInfo } from "os";
import { getMemberRoleInworkspace } from "../services/member.service";

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
    }
)