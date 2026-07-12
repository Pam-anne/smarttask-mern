import { body, validationResult } from "express-validator";

/**
 * Collects validation errors from express-validator and returns a 400
 * with a readable message if any rule failed.
 */
export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors
        .array()
        .map((e) => e.msg)
        .join(", "),
    });
  }
  next();
};

// --- Auth validation chains ---
export const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginRules = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// --- Task validation chains ---
export const createTaskRules = [
  body("title").trim().notEmpty().withMessage("Task title is required"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status"),
  body("deadline")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Deadline must be a valid date"),
];

export const updateTaskRules = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status"),
  body("deadline")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Deadline must be a valid date"),
];
