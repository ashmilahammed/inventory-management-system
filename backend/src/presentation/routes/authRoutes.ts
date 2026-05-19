import express from "express";
import { authController } from "../../di/auth.di";
import { validateLogin } from "../validators/authValidator";

const router = express.Router();

router.post("/login", validateLogin, authController.login.bind(authController));

export default router;