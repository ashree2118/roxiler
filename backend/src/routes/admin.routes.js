import { Router } from "express";
import {
  getDashboard,
  getUsers,
  createUser,
  getStores,
  createStore,
} from "../controllers/admin.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import {
  createUserValidator,
  createStoreValidator,
  listUsersQueryValidator,
  listStoresQueryValidator,
  handleValidationErrors,
} from "../validators/admin.validator.js";

const router = Router();

router.use(verifyToken, requireRole("ADMIN"));

router.get("/dashboard", getDashboard);

router.get(
  "/users",
  listUsersQueryValidator,
  handleValidationErrors,
  getUsers
);

router.post(
  "/users",
  createUserValidator,
  handleValidationErrors,
  createUser
);

router.get(
  "/stores",
  listStoresQueryValidator,
  handleValidationErrors,
  getStores
);

router.post(
  "/stores",
  createStoreValidator,
  handleValidationErrors,
  createStore
);

export default router;
