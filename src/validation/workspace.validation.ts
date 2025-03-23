import { z } from "zod";

export const nameSchema = z.string()
    .trim()
    .min(1, { message: "name is required" })
    .max(255);

export const descriptionSchema = z.string()
    .trim()
    .optional();

export const createWorkspaceSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
});

export const workspaceId = z.string()
    .trim()
    .min(1, { message: "ID is required" });

export const changeRoleSchema = z.object({
    roleId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
});

export const updateWorkspaceSChema = z.object({
    name: nameSchema,
    description: descriptionSchema,
});