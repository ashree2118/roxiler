import { Router } from "express";
import {
  register,
  login,
  changePassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  handleValidationErrors,
} from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/register",
  registerValidator,
  handleValidationErrors,
  register
);

router.post("/login", loginValidator, handleValidationErrors, login);

router.patch(
  "/change-password",
  verifyToken,
  changePasswordValidator,
  handleValidationErrors,
  changePassword
);

export default router;
