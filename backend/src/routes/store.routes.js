import { Router } from "express";
import { getStores, rateStore } from "../controllers/store.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import {
  listStoresQueryValidator,
  rateStoreValidator,
  handleValidationErrors,
} from "../validators/store.validator.js";

const router = Router();

router.use(verifyToken, requireRole("USER"));

router.get("/", listStoresQueryValidator, handleValidationErrors, getStores);

router.post(
  "/:storeId/rate",
  rateStoreValidator,
  handleValidationErrors,
  rateStore
);

export default router;
