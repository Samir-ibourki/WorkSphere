import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log full error trace on the server terminal for developers
  console.error("❌ Internal Server Error:", err);

  // If headers were already sent, delegate to default Express handler
  if (res.headersSent) {
    return _next(err);
  }

  // Handle Prisma / Database internal errors
  if (err?.name?.includes("Prisma") || err?.code?.startsWith("P")) {
    res.status(500).json({
      success: false,
      message: "A database error occurred. Please try again later.",
    });
    return;
  }

  // Handle custom status errors or fallback to clean 500
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message =
    statusCode < 500
      ? err.message || "An error occurred with your request."
      : "An unexpected error occurred. Please try again later.";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

