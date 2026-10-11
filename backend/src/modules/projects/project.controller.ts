import type { Request, Response } from "express";
import { projectService } from "./project.service.js";
import type { createProjectInput, UpdateProjectInput } from "./project.schema.js";

// create project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: createProjectInput = req.body;
    const organizationId = req.user!.organizationId;

    const project = await projectService.createProject(input, organizationId);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create project",
    });
  }
};

// get all projects
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    const projects = await projectService.getProjects(organizationId);

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch projects",
    });
  }
};

// get project By ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const organizationId = req.user!.organizationId;

    const project = await projectService.getProjectById(id, organizationId);

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Project not found",
    });
  }
};

// update project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const input: UpdateProjectInput = req.body;
    const organizationId = req.user!.organizationId;

    const project = await projectService.updateProject(id, input, organizationId);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update project",
    });
  }
};

// delete project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const organizationId = req.user!.organizationId;

    await projectService.deleteProject(id, organizationId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete project",
    });
  }
};
