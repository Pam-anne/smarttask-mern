import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All task routes require a valid token.
router.use(protect);

// Collection routes
router.route("/").get(getTasks).post(createTask);

// Single-resource routes
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
