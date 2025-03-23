import { Router } from "express";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new",createWorkspaceController);


export default workspaceRoutes;