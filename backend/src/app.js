import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// --- Global middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check / root route ---
app.get("/", (req, res) => {
  res.json({ message: "SmartTask API is running 🚀" });
});

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
