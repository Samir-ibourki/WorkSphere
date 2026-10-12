import prisma from "../../prisma/client.js";
import type { createTaskInput, updateTaskInput } from "./task.schema.js";

export const taskService = {
  // create task
  async createTask(input: createTaskInput, organizationId: string) {
    const project = await prisma.project.findFirst({
      where: { id: input.projectId, organizationId },
    });

    if (!project) {
      throw new Error("Project not found in your workspace");
    }

    return await prisma.task.create({
      data: input,
    });
  },

  // get tasks of a project
  async getTasksByProject(projectId: string, organizationId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId },
    });

    if (!project) {
      throw new Error("Project not found in your workspace");
    }

    return await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // get task by id
  async getTaskById(id: string, organizationId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: { organizationId },
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  },

  // update task
  async updateTask(id: string, input: updateTaskInput, organizationId: string) {
    const existing = await prisma.task.findFirst({
      where: {
        id,
        project: { organizationId },
      },
    });
    if (!existing) {
      throw new Error("Task not found");
    }
    return await prisma.task.update({
      where: { id },
      data: input,
    });
  },

  // delete task
  async deleteTask(id: string, organizationId: string) {
    const existing = await prisma.task.findFirst({
      where: {
        id,
        project: { organizationId },
      },
    });
    if (!existing) {
      throw new Error("Task not found");
    }
    return await prisma.task.delete({ where: { id } });
  },
};
