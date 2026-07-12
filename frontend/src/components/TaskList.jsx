import { api } from "../api.js";

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

/**
 * Renders the list of the logged-in user's tasks. Each card shows the
 * title, status badge, deadline and description.
 */
export default function TaskList({ tasks, loading, onDeleted }) {
  async function handleDelete(id) {
    try {
      await api.deleteTask(id);
      onDeleted(id);
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="muted">Loading tasks...</p>;

  if (!tasks.length) {
    return <p className="muted">No tasks yet. Add your first one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="task">
          <div className="task-head">
            <h4>{task.title}</h4>
            <span className={`badge status-${task.status}`}>
              {STATUS_LABELS[task.status] || task.status}
            </span>
          </div>

          {task.description && <p className="task-desc">{task.description}</p>}

          <div className="task-meta">
            <span>📅 {formatDate(task.deadline)}</span>
            <button
              type="button"
              className="link danger"
              onClick={() => handleDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
