import express from "express";
import Grievance from "../models/Grienvance.js";

const router = express.Router();

/**
 * @route   POST /api/grievances
 * @desc    Create a new grievance
 */
router.post("/", async (req, res) => {
  try {
    const { studentId, title, category, priority, description, images } = req.body;

    if (!studentId || !title || !category || !description) {
      return res.status(400).json({ message: "studentId, title, category, and description are required" });
    }

    const grievance = new Grievance({
      studentId,
      title,
      category,
      priority: priority || "Low", // defaults to "Low" if not passed
      description,
      images: images || [],
    });

    await grievance.save();

    res.status(201).json({ message: "Grievance created successfully", grievance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/grievances
 * @desc    Get all grievances
 */
router.get("/", async (req, res) => {
  try {
    const grievances = await Grievance.find().populate("studentId", "name email");
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 1️⃣ Vote for grievance severity (Low / Medium / High)
 * POST /api/grievances/:id/vote
 */
router.post("/api/grievances/:id/vote", async (req, res) => {
  try {
    const { vote } = req.body; // "Low" | "Medium" | "High"
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (!["Low", "Medium", "High"].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote. Use Low, Medium, or High" });
    }

    // Increment vote count
    grievance.votes[vote] = (grievance.votes[vote] || 0) + 1;

    await grievance.save();
    res.json({ message: "Vote counted", votes: grievance.votes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 2️⃣ Edit grievance (PUT) - Only if still pending
 * PUT /api/grievances/:id
 */
router.put("/api/grievances/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (grievance.status !== "pending") {
      return res.status(400).json({ message: "Cannot edit non-pending grievance" });
    }

    const { title, description, category, priority } = req.body;

    if (title) grievance.title = title;
    if (description) grievance.description = description;
    if (category) grievance.category = category;
    if (priority) grievance.priority = priority;

    await grievance.save();
    res.json({ message: "Grievance updated", grievance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 3️⃣ Delete grievance (DELETE) - Only if still pending
 * DELETE /api/grievances/:id
 */
router.delete("/api/grievances/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (grievance.status !== "pending") {
      return res.status(400).json({ message: "Cannot delete non-pending grievance" });
    }

    await grievance.deleteOne();
    res.json({ message: "Grievance deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
