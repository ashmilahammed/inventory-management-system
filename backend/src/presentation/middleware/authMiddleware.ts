import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

      res.status(401).json({
        success: false,
        message: "No token provided"
      });

      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {

      res.status(401).json({
        success: false,
        message: "Invalid token format"
      });

      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = decoded;

    next();

  } catch {

    res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};