import { Router } from "express";
import { customerController } from "../../di/customer.di";
import { authMiddleware } from "../middleware/authMiddleware";
import { Routes } from "../../shared/constants/routes";

const router = Router();

router.use(authMiddleware);

router.post(Routes.CUSTOMERS.CREATE, (req, res) => customerController.create(req, res));
router.get(Routes.CUSTOMERS.GET_ALL, (req, res) => customerController.getAll(req, res));
router.put(Routes.CUSTOMERS.UPDATE, (req, res) => customerController.update(req, res));
router.delete(Routes.CUSTOMERS.DELETE, (req, res) => customerController.delete(req, res));

export default router;
