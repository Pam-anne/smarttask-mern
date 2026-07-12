import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

// Simple incrementing id so we don't rely on Date.now()/random.
let nextId = 1;

/**
 * Provides a `toast()` function to the whole app and renders the toast
 * stack in the corner. Toasts auto-dismiss after a few seconds.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "success") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => remove(t.id)}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Convenience hook: const toast = useToast(); toast("Saved!", "success")
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
