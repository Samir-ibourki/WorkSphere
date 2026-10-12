import type { Request, Response } from "express";
import { taskService } from "./task.service.js";
import type { createTaskInput, updateTaskInput } from "./task.schema.js";

// create Task
export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const input: createTaskInput = req.body;
    const organizationId = req.user!.organizationId; // ⬅️ Hna dima mn Token

    const task = await taskService.createTask(input, organizationId);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create task",
    });
  }
};

// get tasks by Project ID
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.query.projectId as string;
    const organizationId = req.user!.organizationId;

    if (!projectId) {
      res
        .status(400)
        .json({ success: false, message: "projectId query param is required" });
      return;
    }

    const tasks = await taskService.getTasksByProject(
      projectId,
      organizationId,
    );

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch tasks",
    });
  }
};

// get task by ID
export const getTaskById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const organizationId = req.user!.organizationId;

    const task = await taskService.getTaskById(id, organizationId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Task not found",
    });
  }
};

// update Task
export const updateTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const input: updateTaskInput = req.body;
    const organizationId = req.user!.organizationId;

    const task = await taskService.updateTask(id, input, organizationId);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update task",
    });
  }
};

// delete Task
export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const organizationId = req.user!.organizationId;

    await taskService.deleteTask(id, organizationId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete task",
    });
  }
};
