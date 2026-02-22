import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import moviesRoutes from "./modules/movies/movies.routes";
import watchlistRoutes from "./modules/watchlist/watchlist.routes";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(env.port, "0.0.0.0", () => {
  console.log(`🎬 Halalflix API running on http://0.0.0.0:${env.port}`);
  console.log(`   Health check: http://localhost:${env.port}/api/health`);
});

export default app;
