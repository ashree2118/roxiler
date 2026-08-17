import { Router } from "express";
import { getDashboard } from "../controllers/owner.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken, requireRole("STORE_OWNER"));

router.get("/dashboard", getDashboard);

export default router;
