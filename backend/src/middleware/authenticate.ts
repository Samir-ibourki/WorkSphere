import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  organizationId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required. Invalid token format.",
      });
      return;
    }

    const secret = process.env.JWT_SECRET || "default_jwt_secret_dev";
    const decoded = jwt.verify(token, secret) as AuthPayload;

    req.user = {
      userId: decoded.userId,
      organizationId: decoded.organizationId,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
