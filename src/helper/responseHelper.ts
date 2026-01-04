import { Response } from "express";
import { AppError } from "../errors/appError";

// utils/responseHandler.ts
export const handleError = (error: unknown, res: Response): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
    });
    return;
  }

  console.error("Unexpected error:", error);
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server",
  });
};
