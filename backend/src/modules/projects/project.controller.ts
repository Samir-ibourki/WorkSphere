import type { Request, Response, NextFunction } from "express";
import { projectService } from "./project.service.js";
import type { createProjectInput, UpdateProjectInput } from "./project.schema.js";

// create project
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input: createProjectInput = req.body;
    const organizationId = req.user!.organizationId;

    const project = await projectService.createProject(input, organizationId);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// get all projects
export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    const projects = await projectService.getProjects(organizationId);

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// get project By ID
export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const organizationId = req.user!.organizationId;

    const project = await projectService.getProjectById(id, organizationId);

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// update project
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  } catch (error) {
    next(error);
  }
};

// delete project
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const organizationId = req.user!.organizationId;

    await projectService.deleteProject(id, organizationId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
