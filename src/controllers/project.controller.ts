import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { createProjectSchema, projectIdSchema, updateProjectSchema } from "../validation/project.validation";
import { getMemberRoleInworkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { HTTPSTATUS } from "../config/http.config";
import { Permissions } from "../enums/role.enum";
import { createProjectService, deleteProjectService, updateProjectService } from "../services/project.service";

export const createProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = createProjectSchema.parse(req.body);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        const userId = req.user?._id;
        const { role } = await getMemberRoleInworkspace(userId, workspaceId);
        roleGuard(role, [Permissions.CREATE_PROJECT]);

        const { project } = await createProjectService(userId, workspaceId, body);

        return res.status(HTTPSTATUS.CREATED).json({
            message: "Project created successfully",
            project,
        });
    }
);

export const updateProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const projectId = projectIdSchema.parse(req.params.id);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        const body = updateProjectSchema.parse(req.body);

        const { role } = await getMemberRoleInworkspace(userId, workspaceId);
        roleGuard(role, [Permissions.EDIT_PROJECT]);

        const { project } = await updateProjectService(
            workspaceId,
            projectId,
            body
        );

        return res.status(HTTPSTATUS.OK).json({
            message: "Project updated successfully",
            project,
        });
    }
);

// delete project
export const deleteProjectController = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?._id;
  
      const projectId = projectIdSchema.parse(req.params.id);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  
      const { role } = await getMemberRoleInworkspace(userId, workspaceId);
      roleGuard(role, [Permissions.DELETE_PROJECT]);
  
      await deleteProjectService(workspaceId, projectId);
  
      return res.status(HTTPSTATUS.OK).json({
        message: "Project deleted successfully",
      });
    }
  );