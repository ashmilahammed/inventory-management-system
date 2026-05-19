import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { ApiResponse } from "../../shared/common/ApiResponse";

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email) {
    res.status(HttpStatus.BAD_REQUEST).json(
      ApiResponse.error("Email is required")
    );
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(HttpStatus.BAD_REQUEST).json(
      ApiResponse.error("Please provide a valid email address")
    );
    return;
  }

  if (!password) {
    res.status(HttpStatus.BAD_REQUEST).json(
      ApiResponse.error("Password is required")
    );
    return;
  }

  if (password.length < 6) {
    res.status(HttpStatus.BAD_REQUEST).json(
      ApiResponse.error("Password must be at least 6 characters long")
    );
    return;
  }

  next();
};
