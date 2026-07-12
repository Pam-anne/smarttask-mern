import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import {
  runValidation,
  createTaskRules,
  updateTaskRules,
} from "../middleware/validate.js";

const router = express.Router();

// All task routes require a valid token.
router.use(protect);

// Collection routes
router
  .route("/")
  .get(getTasks)
  .post(createTaskRules, runValidation, createTask);

// Single-resource routes
router
  .route("/:id")
  .get(getTaskById)
  .put(updateTaskRules, runValidation, updateTask)
  .delete(deleteTask);

export default router;
