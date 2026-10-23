import type { Request, Response } from "express";
import { dashboardService } from "./dashboard.service.js";

export const getDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    const data = await dashboardService.getDashboardStats(organizationId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard statistics",
    });
  }
};
