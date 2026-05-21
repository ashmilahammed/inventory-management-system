import { Router } from "express";
import { reportController } from "../../di/reports.di";
import { authMiddleware } from "../middleware/authMiddleware";
import { Routes } from "../../shared/constants/routes";

const router = Router();

router.use(authMiddleware);

router.get(Routes.REPORTS.SALES, (req, res) => reportController.getSalesReport(req, res));
router.get(Routes.REPORTS.ITEMS, (req, res) => reportController.getItemsReport(req, res));
router.get(Routes.REPORTS.LEDGER, (req, res) => reportController.getCustomerLedger(req, res));
router.get(Routes.REPORTS.SALES_EXPORT, (req, res) => reportController.exportSalesReport(req, res));
router.get(Routes.REPORTS.ITEMS_EXPORT, (req, res) => reportController.exportItemsReport(req, res));
router.get(Routes.REPORTS.LEDGER_EXPORT, (req, res) => reportController.exportCustomerLedger(req, res));
router.post(Routes.REPORTS.EMAIL, (req, res) => reportController.emailReport(req, res));

export default router;
