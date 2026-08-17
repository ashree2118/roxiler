import { body, param, query } from "express-validator";
import {
  passwordRules,
  handleValidationErrors,
} from "./auth.validator.js";

const ROLES = ["ADMIN", "USER", "STORE_OWNER"];

export const createUserValidator = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required")
    .normalizeEmail(),
  passwordRules("password"),
  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must not exceed 400 characters"),
  body("role")
    .isIn(ROLES)
    .withMessage("Role must be ADMIN, USER, or STORE_OWNER"),
];

export const createStoreValidator = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage("Store name must be between 1 and 60 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required")
    .normalizeEmail(),
  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must not exceed 400 characters"),
  body("ownerId")
    .optional({ values: "null" })
    .isUUID()
    .withMessage("Owner ID must be a valid UUID"),
];

export const listUsersQueryValidator = [
  query("name").optional().trim().isString(),
  query("email").optional().trim().isString(),
  query("address").optional().trim().isString(),
  query("role")
    .optional()
    .isIn(ROLES)
    .withMessage("Role must be ADMIN, USER, or STORE_OWNER"),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "address", "role", "createdAt"])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export const listStoresQueryValidator = [
  query("name").optional().trim().isString(),
  query("email").optional().trim().isString(),
  query("address").optional().trim().isString(),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "address", "averageRating", "createdAt"])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export { handleValidationErrors };
