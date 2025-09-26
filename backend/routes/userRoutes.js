import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * Register User
 * POST /api/users/register
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Don't send password back
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    
    res.status(201).json({ 
      message: "User registered successfully", 
      user: userWithoutPassword 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * Login User
 * POST /api/users/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ 
      message: "Login successful", 
      user: userWithoutPassword 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get all users (for testing)
 * GET /api/users
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;