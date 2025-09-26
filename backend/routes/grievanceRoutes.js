import express from "express";
import mongoose from "mongoose";
import Grievance from "../models/Grievance.js";

const router = express.Router();

/**
 * @route   POST /api/grievances
 * @desc    Create a new grievance
 */
router.post("/", async (req, res) => {
  try {
    console.log("Received grievance data:", req.body);

    const { studentId, title, category, priority, description, images } = req.body;

    // Validation
    if (!studentId || !title || !category || !description) {
      return res.status(400).json({ 
        message: "studentId, title, category, and description are required",
        received: { studentId, title, category, description }
      });
    }

    // Validate ObjectId format or create a new one if it's a mock ID
    let validStudentId;
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      validStudentId = studentId;
    } else {
      // For development/testing: create a new ObjectId if the provided ID is invalid
      console.log(`Invalid ObjectId: ${studentId}, creating new ObjectId for testing`);
      validStudentId = new mongoose.Types.ObjectId();
    }

    // Create new grievance
    const grievance = new Grievance({
      studentId: validStudentId,
      title,
      category,
      priority: priority || "Low",
      description,
      images: images || [],
    });

    console.log("Creating grievance with valid ObjectId:", grievance);

    const savedGrievance = await grievance.save();
    console.log("Grievance saved successfully:", savedGrievance);

    res.status(201).json({ 
      message: "Grievance created successfully", 
      grievance: savedGrievance 
    });

  } catch (error) {
    console.error("Error creating grievance:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/grievances
 * @desc    Get all grievances
 */
router.get("/", async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate("studentId", "name email")
      .sort({ submittedAt: -1 }); // Most recent first
    res.json(grievances);
  } catch (error) {
    console.error("Error fetching grievances:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/grievances/:id
 * @desc    Get a single grievance by ID
 */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid grievance ID format" });
    }

    const grievance = await Grievance.findById(req.params.id)
      .populate("studentId", "name email");

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.json(grievance);
  } catch (error) {
    console.error("Error fetching grievance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/grievances/user/:userId
 * @desc    Get grievances by user
 */
router.get("/user/:userId", async (req, res) => {
  try {
    let validUserId;
    if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
      validUserId = req.params.userId;
    } else {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const grievances = await Grievance.find({ studentId: validUserId })
      .sort({ submittedAt: -1 });
    res.json(grievances);
  } catch (error) {
    console.error("Error fetching user grievances:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/grievances/:id/vote
 * @desc    Vote for grievance severity
 */
router.post("/:id/vote", async (req, res) => {
  try {
    const { vote } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid grievance ID format" });
    }

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (!["Low", "Medium", "High"].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote. Use Low, Medium, or High" });
    }

    grievance.votes[vote] = (grievance.votes[vote] || 0) + 1;
    await grievance.save();
    
    res.json({ message: "Vote counted", votes: grievance.votes });
  } catch (error) {
    console.error("Error voting on grievance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/grievances/:id/status
 * @desc    Update grievance status (for admin use)
 */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid grievance ID format" });
    }

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use pending, reviewed, resolved, or rejected" });
    }

    grievance.status = status;
    grievance.updatedAt = new Date();
    await grievance.save();
    
    res.json({ message: "Status updated successfully", grievance });
  } catch (error) {
    console.error("Error updating grievance status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/grievances/:id
 * @desc    Delete a grievance
 */
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid grievance ID format" });
    }

    const grievance = await Grievance.findByIdAndDelete(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.json({ message: "Grievance deleted successfully", grievanceId: req.params.id });
  } catch (error) {
    console.error("Error deleting grievance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;