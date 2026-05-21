import { Router } from "express";
import { salesController } from "../../di/sales.di";
import { authMiddleware } from "../middleware/authMiddleware";
import { Routes } from "../../shared/constants/routes";

const router = Router();

router.use(authMiddleware);

router.post(Routes.SALES.RECORD, (req, res) => salesController.recordSale(req, res));

export default router;
