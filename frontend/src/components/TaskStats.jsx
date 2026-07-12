/**
 * A small summary bar showing how many tasks fall into each status.
 * Counts are derived from the currently loaded tasks.
 */
export default function TaskStats({ tasks }) {
  const counts = tasks.reduce(
    (acc, t) => {
      acc.total += 1;
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { total: 0, pending: 0, "in-progress": 0, completed: 0 }
  );

  const items = [
    { label: "Total", value: counts.total, cls: "total" },
    { label: "Pending", value: counts.pending, cls: "pending" },
    { label: "In progress", value: counts["in-progress"], cls: "in-progress" },
    { label: "Completed", value: counts.completed, cls: "completed" },
  ];

  return (
    <div className="stats">
      {items.map((it) => (
        <div key={it.label} className={`stat stat-${it.cls}`}>
          <span className="stat-value">{it.value}</span>
          <span className="stat-label">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
