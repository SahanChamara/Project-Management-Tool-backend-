import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceSchema } from "../validation/workspace.validation";
import { createWorkspaceService, getAllWorkspaceUserIsMemberService } from "../services/workspace.service";
import { HTTPSTATUS } from "../config/http.config";
import { userInfo } from "os";

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
)