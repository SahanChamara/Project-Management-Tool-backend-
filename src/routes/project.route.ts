import { Router } from "express";
import { createProjectController, deleteProjectController, updateProjectController } from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectController);
projectRoutes.put("/:id/workspace/:workspaceId/update", updateProjectController);
projectRoutes.delete(
    "/:id/workspace/:workspaceId/delete",
    deleteProjectController
  );

export default projectRoutes;