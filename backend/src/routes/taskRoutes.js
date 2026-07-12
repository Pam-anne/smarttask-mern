import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Collection routes
router.route("/").get(getTasks).post(createTask);

// Single-resource routes
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
