import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 10
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High"], 
    default: "Low" 
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 20
  },
  images: [{ 
    type: String 
  }],
  votes: {
    Low: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    High: { type: Number, default: 0 },
  },
  status: { 
    type: String, 
    enum: ["pending", "reviewed", "resolved"], 
    default: "pending" 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Add indexes for better performance
grievanceSchema.index({ studentId: 1 });
grievanceSchema.index({ status: 1 });
grievanceSchema.index({ submittedAt: -1 });

export default mongoose.model("Grievance", grievanceSchema);