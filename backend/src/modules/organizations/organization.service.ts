import prisma from "../../prisma/client.js";
import type { UpdateOrganizationInput } from "./organization.schema.js";

export const organizationService = {
  // get infos of my organization
  async getOrganizationById(id: string) {
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    return organization;
  },

  // update organization
  async updateOrganization(id: string, input: UpdateOrganizationInput) {
    return await prisma.organization.update({
      where: { id },
      data: input,
    });
  },

  // get organization users
  async getOrganizationUsers(organizationId: string) {
    return await prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  },
};
