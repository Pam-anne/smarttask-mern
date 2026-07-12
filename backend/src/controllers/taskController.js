import Task from "../models/Task.js";

/**
 * @desc    Create a new task for the logged-in user
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, deadline } = req.body;

    // Associate the task with the authenticated user.
    const task = await Task.create({
      title,
      description,
      status,
      deadline,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the logged-in user's tasks, with optional filtering and sorting
 * @route   GET /api/tasks
 * @access  Private
 *
 * Query params (all optional):
 *   status  - filter by task status (pending | in-progress | completed)
 *   search  - case-insensitive match on title or description
 *   sortBy  - field to sort by: createdAt | deadline | title (default createdAt)
 *   order   - asc | desc (default desc)
 */
export const getTasks = async (req, res, next) => {
  try {
    const { status, search, sortBy, order } = req.query;

    // Always scope to the current user.
    const filter = { user: req.user._id };

    // Filter by status when a specific one is requested.
    const allowedStatuses = ["pending", "in-progress", "completed"];
    if (status && allowedStatuses.includes(status)) {
      filter.status = status;
    }

    // Search across title and description (case-insensitive).
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

    // Sorting: whitelist the fields to avoid arbitrary sort injection.
    const allowedSortFields = ["createdAt", "deadline", "title"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task owned by the logged-in user
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task owned by the logged-in user
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      {
        new: true, // return the updated document
        runValidators: true, // enforce schema validation on update
      }
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task owned by the logged-in user
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted", data: {} });
  } catch (error) {
    next(error);
  }
};
