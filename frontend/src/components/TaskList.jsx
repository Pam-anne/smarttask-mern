import TaskItem from "./TaskItem.jsx";

/**
 * Renders the list of the logged-in user's tasks. Each item can be
 * edited inline or deleted (handled inside TaskItem).
 */
export default function TaskList({ tasks, loading, onUpdated, onDeleted }) {
  if (loading) return <p className="muted">Loading tasks...</p>;

  if (!tasks.length) {
    return <p className="muted">No tasks yet. Add your first one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      ))}
    </ul>
  );
}
