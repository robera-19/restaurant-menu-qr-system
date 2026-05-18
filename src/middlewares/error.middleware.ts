import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Handle Zod Validation Errors (Cleanest way for frontend)
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map((e) => ({ field: e.path[1], message: e.message })),
    });
  }

  // 2. Handle Prisma Specific Errors
  if (err.code === "P2002") {
    return res.status(400).json({ message: "Email already exists" });
  }

  if (err.message.includes("Invalid value for argument")) {
    return res
      .status(400)
      .json({ message: "Invalid data provided for fields like Role" });
  }

  // 3. Final Fallback
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
