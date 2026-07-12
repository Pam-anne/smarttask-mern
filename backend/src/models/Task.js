import mongoose from "mongoose";

/**
 * Task schema.
 * Captures the fields required by the brief: a title, an optional
 * description, a deadline, and a status used to track progress.
 * A `user` reference is included so tasks can be scoped per-user once
 * authentication is added in a later phase.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A task title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    deadline: {
      type: Date,
      default: null,
    },
    // Reserved for Phase 2 (authentication). Optional for now.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    // Adds createdAt and updatedAt fields automatically.
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
