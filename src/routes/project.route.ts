import { Router } from "express";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectController);

