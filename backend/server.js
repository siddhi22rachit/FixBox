import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import grievanceRoutes from "./routes/grievanceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js frontend
    credentials: true, // allow cookies / auth headers if needed
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use(grievanceRoutes);
app.use(userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
