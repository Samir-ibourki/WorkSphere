import { z } from "zod";

export const createProjectSchema = z.object({
    name : z.string().min(3, "Name must be at least 3 characters"),
    description : z.string().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional().default("ACTIVE"),
})

export const updateProjectSchema = createProjectSchema.partial();


export type createProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;