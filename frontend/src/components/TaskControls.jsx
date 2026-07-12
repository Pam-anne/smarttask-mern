/**
 * Filter & sort controls. Fully controlled by the parent via `filters`
 * and `onChange`, so the parent can refetch tasks whenever they change.
 */
export default function TaskControls({ filters, onChange }) {
  function set(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="card controls">
      <input
        type="search"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
      />

      <div className="row">
        <label>
          Status
          <select
            value={filters.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Sort by
          <select
            value={filters.sortBy}
            onChange={(e) => set("sortBy", e.target.value)}
          >
            <option value="createdAt">Date created</option>
            <option value="deadline">Deadline</option>
            <option value="title">Title</option>
          </select>
        </label>

        <label>
          Order
          <select
            value={filters.order}
            onChange={(e) => set("order", e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>
    </div>
  );
}
