import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/flower_shop";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));
