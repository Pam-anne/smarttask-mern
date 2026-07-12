import { useEffect, useState } from "react";
import { api } from "./api.js";
import AuthForm from "./components/AuthForm.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

export default function App() {
  // Restore the logged-in user from localStorage on first load.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load the user's tasks whenever they are logged in.
  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    api
      .getTasks()
      .then((res) => active && setTasks(res.data))
      .catch((err) => {
        // An expired/invalid token means we should log out.
        if (err.message.toLowerCase().includes("not authorized")) logout();
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTasks([]);
  }

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
        <TaskForm onCreated={(task) => setTasks((prev) => [task, ...prev])} />

        <section>
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
