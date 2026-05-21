import express from "express";
import { authController } from "../../di/auth.di";
import { validateLogin } from "../validators/authValidator";
import { Routes } from "../../shared/constants/routes";

const router = express.Router();

router.post(Routes.AUTH.LOGIN, validateLogin, authController.login.bind(authController));

export default router;