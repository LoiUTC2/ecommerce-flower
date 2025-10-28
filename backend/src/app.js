import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import session from "express-session";


import authRoutes from "./routes/authRoutes.js";

dotenv.config();
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
app.use(cookieParser());
app.use(morgan("dev"));


// Routes
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => res.json({ message: "🌸 Flower Shop API Running!" }));

export default app;
