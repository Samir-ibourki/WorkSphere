import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  projectId: z.string().min(1, "projectId is required"),
  assignedToId: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .omit({ projectId: true });

export type createTaskInput = z.infer<typeof createTaskSchema>;
export type updateTaskInput = z.infer<typeof updateTaskSchema>;
