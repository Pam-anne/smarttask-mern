import { useState } from "react";
import { api } from "../api.js";
import { useToast } from "../context/ToastContext.jsx";

const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In progress",
  completed: "Completed",
};

function formatDate(value) {
  if (!value) return "No deadline";
  const d = new Date(value);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Turn an ISO/date string into the yyyy-mm-dd value an <input type="date"> needs.
function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

// A task is overdue if its deadline has passed and it isn't completed yet.
function isOverdue(task) {
  if (!task.deadline || task.status === "completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.deadline) < today;
}

/**
 * A single task. Shows a read-only view with a quick-complete checkbox and
 * Edit/Delete actions, and switches to an inline edit form when editing.
 */
export default function TaskItem({ task, onUpdated, onDeleted }) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [deadline, setDeadline] = useState(toDateInput(task.deadline));

  const overdue = isOverdue(task);
  const done = task.status === "completed";

  function startEdit() {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setDeadline(toDateInput(task.deadline));
    setError("");
    setEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = { title, description, status, deadline: deadline || null };
      const res = await api.updateTask(task._id, payload);
      onUpdated(res.data);
      setEditing(false);
      toast("Task updated");
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  // Quick toggle between completed and pending straight from the list.
  async function toggleComplete() {
    setBusy(true);
    try {
      const next = done ? "pending" : "completed";
      const res = await api.updateTask(task._id, { status: next });
      onUpdated(res.data);
      toast(next === "completed" ? "Marked complete" : "Marked pending");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    setBusy(true);
    try {
      await api.deleteTask(task._id);
      onDeleted(task._id);
      toast("Task deleted");
    } catch (err) {
      toast(err.message, "error");
      setBusy(false);
    }
  }

  // --- Edit mode ---
  if (editing) {
    return (
      <li className="task">
        <form onSubmit={handleSave}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Description (optional)"
          />
          <div className="row">
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label>
              Deadline
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </label>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="task-actions">
            <button type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="link"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  // --- Read-only view ---
  return (
    <li className={`task ${done ? "task-done" : ""} ${overdue ? "task-overdue" : ""}`}>
      <div className="task-head">
        <label className="check">
          <input
            type="checkbox"
            checked={done}
            onChange={toggleComplete}
            disabled={busy}
          />
          <h4>{task.title}</h4>
        </label>
        <span className={`badge status-${task.status}`}>
          {STATUS_LABELS[task.status] || task.status}
        </span>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-meta">
        <span className={overdue ? "overdue-text" : ""}>
          📅 {formatDate(task.deadline)}
          {overdue && <span className="overdue-tag">Overdue</span>}
        </span>
        <div className="task-actions">
          <button
            type="button"
            className="link"
            onClick={startEdit}
            disabled={busy}
          >
            Edit
          </button>
          <button
            type="button"
            className="link danger"
            onClick={handleDelete}
            disabled={busy}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
