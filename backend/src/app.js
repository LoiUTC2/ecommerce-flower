import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
    res.json({ message: "🌸 Flower Shop API is running!" });
});

// Routes
app.use("/api", router);

app.use("/api/auth", authRoutes);

export default app;
