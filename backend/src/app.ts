import express from "express";
import cors from "cors";

import authRoutes from "./presentation/routes/authRoutes";
import testRoutes from "./presentation/routes/testRoutes";
import inventoryRoutes from "./presentation/routes/inventoryRoutes";
import customerRoutes from "./presentation/routes/customerRoutes";
import salesRoutes from "./presentation/routes/salesRoutes";
import reportRoutes from "./presentation/routes/reportRoutes";
import { Routes } from "./shared/constants/routes";

const app = express();

// app.use(cors();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stocksmart-frontend-beta.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use(Routes.AUTH.BASE, authRoutes);
app.use(Routes.TEST.BASE, testRoutes);
app.use(Routes.INVENTORY.BASE, inventoryRoutes);
app.use(Routes.CUSTOMERS.BASE, customerRoutes);
app.use(Routes.SALES.BASE, salesRoutes);
app.use(Routes.REPORTS.BASE, reportRoutes);

export default app;