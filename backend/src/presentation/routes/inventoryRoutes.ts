import { Router } from "express";
import { inventoryController } from "../../di/inventory.di";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", (req, res) => inventoryController.create(req, res));
router.get("/", (req, res) => inventoryController.getAll(req, res));
router.put("/:id", (req, res) => inventoryController.update(req, res));
router.delete("/:id", (req, res) => inventoryController.delete(req, res));

export default router;
