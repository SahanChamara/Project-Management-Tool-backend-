import { Router } from "express";
import { changeWorkspaceMemberRoleController, createWorkspaceController, deleteWorkspaceByIdController, getAllWorkspacesUserIsMemberController, getWoorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController, updateWorkspaceByIdController } from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController);

workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);
workspaceRoutes.get("/:id", getWorkspaceByIdController);
workspaceRoutes.get("/members/:id", getWorkspaceMembersController);
workspaceRoutes.get("/analytics/:id", getWoorkspaceAnalyticsController);

workspaceRoutes.put("/change/member/role/:id", changeWorkspaceMemberRoleController);
workspaceRoutes.put("/update/:id", updateWorkspaceByIdController);

workspaceRoutes.delete("/delete/:id", deleteWorkspaceByIdController);

export default workspaceRoutes;