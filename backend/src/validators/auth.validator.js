import { body, validationResult } from "express-validator";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;

export const passwordRules = (field = "password") =>
  body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(PASSWORD_REGEX)
    .withMessage(
      "Password must contain at least one uppercase letter and one special character (!@#$%^&*)"
    );

export const registerValidator = [
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
    .optional()
    .isIn(["USER", "STORE_OWNER"])
    .withMessage("Role must be USER or STORE_OWNER"),
  body("storeName")
    .if(body("role").equals("STORE_OWNER"))
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Store name must be between 20 and 60 characters"),
  body("storeEmail")
    .if(body("role").equals("STORE_OWNER"))
    .trim()
    .isEmail()
    .withMessage("A valid store email address is required")
    .normalizeEmail(),
  body("storeAddress")
    .if(body("role").equals("STORE_OWNER"))
    .trim()
    .isLength({ max: 400 })
    .withMessage("Store address must not exceed 400 characters"),
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  passwordRules("newPassword"),
];

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}
