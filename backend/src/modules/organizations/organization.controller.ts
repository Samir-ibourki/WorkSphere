import type { Request, Response } from "express";
import { organizationService } from "./organization.service.js";
import type { UpdateOrganizationInput } from "./organization.schema.js";

// get my organization
export const getOrganization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    const organization =
      await organizationService.getOrganizationById(organizationId);

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to get organization",
    });
  }
};

// update organization
export const updateOrganization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    const input: UpdateOrganizationInput = req.body;

    const updated = await organizationService.updateOrganization(
      organizationId,
      input,
    );

    res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update organization",
    });
  }
};

// get users of my organization
export const getOrganizationUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    const users =
      await organizationService.getOrganizationUsers(organizationId);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch organization users",
    });
  }
};

// invite / add member
export const inviteMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    const member = await organizationService.inviteMember(
      organizationId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: member,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add member",
    });
  }
};

// remove member
export const removeMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    const currentUserId = req.user!.userId;
    const userId = req.params.userId as string;

    await organizationService.removeMember(
      organizationId,
      userId,
      currentUserId,
    );

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to remove member",
    });
  }
};
