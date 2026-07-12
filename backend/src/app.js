import express from "express";
import cors from "cors";
import helmet from "helmet";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { authLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// --- Security & global middleware ---
app.use(helmet()); // sets secure HTTP response headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check / root route ---
app.get("/", (req, res) => {
  res.json({ message: "SmartTask API is running 🚀" });
});

// --- API routes ---
// Rate-limit the auth endpoints to slow down brute-force attempts.
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
