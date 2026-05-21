import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./infrastructure/database/connection";
import { emailService } from "./di/reports.di";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await emailService.initialize();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);