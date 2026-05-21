import { Router } from "express";
import { inventoryController } from "../../di/inventory.di";
import { authMiddleware } from "../middleware/authMiddleware";
import { Routes } from "../../shared/constants/routes";

const router = Router();

router.use(authMiddleware);

router.post(Routes.INVENTORY.CREATE, (req, res) => inventoryController.create(req, res));
router.get(Routes.INVENTORY.GET_ALL, (req, res) => inventoryController.getAll(req, res));
router.put(Routes.INVENTORY.UPDATE, (req, res) => inventoryController.update(req, res));
router.delete(Routes.INVENTORY.DELETE, (req, res) => inventoryController.delete(req, res));

export default router;
