import bcrypt from "bcryptjs";
import prisma from "../../prisma/client.js";
import type { UpdateOrganizationInput, InviteMemberInput } from "./organization.schema.js";

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

  // invite / add member to organization
  async inviteMember(organizationId: string, input: InviteMemberInput) {
    const email = input.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.organizationId === organizationId) {
        throw new Error("User is already a member of this workspace");
      }
      throw new Error("A user with this email already belongs to another organization");
    }

    // Default password for invited member
    const hashedPassword = await bcrypt.hash("WorkSphere2026!", 10);
    const memberName: string = input.name?.trim() || email.split("@")[0] || "Member";

    return await prisma.user.create({
      data: {
        email,
        name: memberName,
        password: hashedPassword,
        organizationId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  },

  // remove member from organization
  async removeMember(organizationId: string, userId: string, currentUserId: string) {
    if (userId === currentUserId) {
      throw new Error("You cannot remove yourself from the workspace");
    }

    const member = await prisma.user.findFirst({
      where: { id: userId, organizationId },
    });

    if (!member) {
      throw new Error("Member not found in your workspace");
    }

    return await prisma.user.delete({
      where: { id: userId },
    });
  },
};
