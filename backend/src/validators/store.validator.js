import { body, param, query } from "express-validator";
import { handleValidationErrors } from "./auth.validator.js";

export const listStoresQueryValidator = [
  query("name").optional().trim().isString(),
  query("address").optional().trim().isString(),
  query("sortBy")
    .optional()
    .isIn(["name", "address", "averageRating", "createdAt"])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export const rateStoreValidator = [
  param("storeId").isUUID().withMessage("Store ID must be a valid UUID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];

export { handleValidationErrors };
