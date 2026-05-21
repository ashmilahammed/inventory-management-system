import express from "express";

import {
  authMiddleware,
  AuthenticatedRequest
} from "../middleware/authMiddleware";
import { Routes } from "../../shared/constants/routes";

const router = express.Router();

router.get(
  Routes.TEST.PROTECTED,
  authMiddleware,

  (req: AuthenticatedRequest, res) => {

    res.status(200).json({
      success: true,
      message: "Protected route accessed",
      user: req.user
    });
  }
);

export default router;