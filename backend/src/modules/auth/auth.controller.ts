import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input: RegisterInput = req.body;
    const result = await authService.register(input);

    res.status(201).json({
      success: true,
      message: "Workspace and user registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input: LoginInput = req.body;
    const result = await authService.login(input);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const result = await authService.getMe(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "User not found",
    });
  }
};
