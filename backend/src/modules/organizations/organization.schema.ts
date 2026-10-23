import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
});
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
