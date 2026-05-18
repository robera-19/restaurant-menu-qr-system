import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { setupSwagger } from "./config/swagger";

const app: Application = express();

// 1. GLOBAL MIDDLEWARES
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for frontend
app.use(morgan("dev")); // Log requests to console
app.use(express.json()); // Parse JSON bodies

setupSwagger(app);

// 2. HEALTH CHECK
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Server is healthy" });
});

// 3. ROUTES
app.use("/api/v1/auth", authRoutes);

// 4. 404 HANDLER
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
