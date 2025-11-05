import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import session from "express-session";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import shopInfoRoutes from "./routes/shopInfoRoutes.js";
import shopReviewRoutes from "./routes/shopReviewRoutes.js";
import productReviewRoutes from "./routes/productReviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(morgan("dev"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/product/reviews", productReviewRoutes);
app.use("/api/shop", shopInfoRoutes);
app.use("/api/shop/reviews", shopReviewRoutes);
app.use("/api/notification", notificationRoutes);

app.get("/", (req, res) => res.json({ message: "🌸 Flower Shop API Running!" }));

export default app;
