import { Router } from "express";
import { reportController } from "../../di/reports.di";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/sales", (req, res) => reportController.getSalesReport(req, res));
router.get("/items", (req, res) => reportController.getItemsReport(req, res));
router.get("/ledger/:customerId", (req, res) => reportController.getCustomerLedger(req, res));
router.get("/sales/export", (req, res) => reportController.exportSalesReport(req, res));

export default router;
