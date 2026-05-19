import { Router } from "express";
import { customerController } from "../../di/customer.di";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", (req, res) => customerController.create(req, res));
router.get("/", (req, res) => customerController.getAll(req, res));
router.put("/:id", (req, res) => customerController.update(req, res));
router.delete("/:id", (req, res) => customerController.delete(req, res));

export default router;
