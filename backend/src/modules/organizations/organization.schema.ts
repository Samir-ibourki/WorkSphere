import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
