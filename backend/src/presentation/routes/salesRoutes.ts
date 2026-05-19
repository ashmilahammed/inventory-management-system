import { Router } from "express";
import { salesController } from "../../di/sales.di";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", (req, res) => salesController.recordSale(req, res));

export default router;
