import { useCallback, useEffect, useState } from "react";
import { api } from "./api.js";
import AuthForm from "./components/AuthForm.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskControls from "./components/TaskControls.jsx";
import TaskList from "./components/TaskList.jsx";

const DEFAULT_FILTERS = {
  search: "",
  status: "",
  sortBy: "createdAt",
  order: "desc",
};

export default function App() {
  // Restore the logged-in user from localStorage on first load.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTasks([]);
  }

  // Fetch tasks from the backend using the current filters/sort options.
  const loadTasks = useCallback(
    async (signalActive = () => true) => {
      setLoading(true);
      try {
        const res = await api.getTasks(filters);
        if (signalActive()) setTasks(res.data);
      } catch (err) {
        if (err.message.toLowerCase().includes("not authorized")) logout();
      } finally {
        if (signalActive()) setLoading(false);
      }
    },
    [filters]
  );

  // Reload whenever the user logs in or the filters change.
  // A short debounce keeps typing in the search box from spamming the API.
  useEffect(() => {
    if (!user) return;
    let active = true;
    const t = setTimeout(() => loadTasks(() => active), 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [user, loadTasks]);

  if (!user) {
    return (
      <div className="app-shell centered">
        <h1 className="brand">SmartTask</h1>
        <AuthForm onAuth={setUser} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1 className="brand">SmartTask</h1>
        <div className="user-box">
          <span className="muted">Hi, {user.name}</span>
          <button type="button" className="link" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="layout">
        {/* Reload after creating so the new task respects the current filters/sort. */}
        <TaskForm onCreated={() => loadTasks()} />

        <section>
          <TaskControls filters={filters} onChange={setFilters} />

          <h3>My tasks ({tasks.length})</h3>
          <TaskList
            tasks={tasks}
            loading={loading}
            onUpdated={(updated) =>
              setTasks((prev) =>
                prev.map((t) => (t._id === updated._id ? updated : t))
              )
            }
            onDeleted={(id) =>
              setTasks((prev) => prev.filter((t) => t._id !== id))
            }
          />
        </section>
      </main>
    </div>
  );
}
