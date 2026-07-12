import { useState } from "react";
import { api } from "../api.js";

/**
 * Controlled form for creating a new task. On success it calls
 * onCreated(task) so the parent can add it to the list.
 */
export default function TaskForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { title, description, status };
      if (deadline) payload.deadline = deadline;

      const res = await api.createTask(payload);
      onCreated(res.data);

      // Reset the form.
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDeadline("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h3>Add a new task</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
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

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add task"}
        </button>
      </form>
    </div>
  );
}
