import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * 1️⃣ Register User
 * POST /api/auth/register
 */
router.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 2️⃣ Login User
 * POST /api/auth/login
 */
router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
