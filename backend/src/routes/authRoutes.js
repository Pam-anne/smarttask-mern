import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import {
  runValidation,
  registerRules,
  loginRules,
} from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerRules, runValidation, registerUser);
router.post("/login", loginRules, runValidation, loginUser);
router.get("/me", protect, getMe);

export default router;
