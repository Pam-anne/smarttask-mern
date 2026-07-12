import { useState } from "react";
import { api } from "../api.js";
import { useToast } from "../context/ToastContext.jsx";

/**
 * Login / Register form. On success it saves the JWT and user, then
 * calls onAuth() so the app can switch to the tasks view.
 */
export default function AuthForm({ onAuth }) {
  const toast = useToast();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = isRegister
        ? { name, email, password }
        : { email, password };
      const res = isRegister
        ? await api.register(payload)
        : await api.login(payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast(`Welcome${isRegister ? "" : " back"}, ${res.data.name}!`);
      onAuth(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card auth-card">
      <h2>{isRegister ? "Create account" : "Welcome back"}</h2>
      <p className="muted">
        {isRegister ? "Sign up to manage your tasks" : "Log in to your tasks"}
      </p>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <button
            type="button"
            className="show-toggle"
            onClick={() => setShowPassword((s) => !s)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Sign up" : "Log in"}
        </button>
      </form>

      <p className="switch">
        {isRegister ? "Already have an account?" : "New here?"}{" "}
        <button
          type="button"
          className="link"
          onClick={() => {
            setError("");
            setMode(isRegister ? "login" : "register");
          }}
        >
          {isRegister ? "Log in" : "Create one"}
        </button>
      </p>
    </div>
  );
}
