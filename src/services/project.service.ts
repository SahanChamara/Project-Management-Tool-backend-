import ProjectModel from "../models/project.mode";
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/appError";


// Create Project
export const createProjectService = async (
    userId: string,
    workspaceId: string,
    body: {
        emoji?: string;
        name: string;
        description?: string;
    }
) => {
    const project = new ProjectModel({
        ...(body.emoji && { emoji: body.emoji }),
        name: body.name,
        description: body.description,
        workspace: workspaceId,
        createdBy: userId,
    });

    await project.save();

    return { project };
};

// Update Project
export const updateProjectService = async (
    workspaceId: string,
    projectId: string,
    body: {
        emoji?: string;
        name: string;
        description?: string;
    }
) => {
    const { name, emoji, description } = body;

    const project = await ProjectModel.findOne({
        _id: projectId,
        workspace: workspaceId,
    });

    if (!project) {
        throw new NotFoundException(
            "Project not found or does not belong to the specified workspace"
        );
    }

    if (emoji) project.emoji = emoji;
    if (name) project.name = name;
    if (description) project.description = description;

    await project.save();

    return { project };
};

// delete project
export const deleteProjectService = async (
    workspaceId: string,
    projectId: string
  ) => {
    const project = await ProjectModel.findOne({
      _id: projectId,
      workspace: workspaceId,
    });
  
    if (!project) {
      throw new NotFoundException(
        "Project not found or does not belong to the specified workspace"
      );
    }
  
    await project.deleteOne();
  
    await TaskModel.deleteMany({
      project: project._id,
    });
  
    return project;
  };