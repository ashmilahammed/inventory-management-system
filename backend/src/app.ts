import express from "express";
import cors from "cors";

import authRoutes from "./presentation/routes/authRoutes";

import testRoutes from "./presentation/routes/testRoutes";
import inventoryRoutes from "./presentation/routes/inventoryRoutes";
import customerRoutes from "./presentation/routes/customerRoutes";
import salesRoutes from "./presentation/routes/salesRoutes";
import reportRoutes from "./presentation/routes/reportRoutes";

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

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportRoutes);

export default app;