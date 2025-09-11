import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Infrastructure, Network, Food
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  description: { type: String, required: true },
  images: [{ type: String }], // store filenames/URLs
  votes: {
    Low: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    High: { type: Number, default: 0 },
  },
  status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Grievance", grievanceSchema);
