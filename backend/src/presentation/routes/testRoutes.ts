import express from "express";

import {
  authMiddleware,
  AuthenticatedRequest
} from "../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/protected",
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