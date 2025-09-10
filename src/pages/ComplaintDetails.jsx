"use client"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, User, MessageSquare, CheckCircle, Clock, AlertCircle, XCircle, Users } from "lucide-react"
import { SAMPLE_COMPLAINTS } from "../utils/constants"
import Navbar from "../components/Navbar"

const StatusTag = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          text: "Pending Review",
          className: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300",
        }
      case "in-progress":
        return {
          icon: AlertCircle,
          text: "In Progress",
          className: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300",
        }
      case "resolved":
        return {
          icon: CheckCircle,
          text: "Resolved ✨",
          className: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300",
        }
      case "rejected":
        return {
          icon: XCircle,
          text: "Not Approved",
          className: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300",
        }
      default:
        return {
          icon: Clock,
          text: "Unknown",
          className: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300",
        }
    }
  }

  const { icon: Icon, text, className } = getStatusConfig()

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${className} shadow-sm`}
    >
      <Icon className="w-4 h-4" />
      {text}
    </div>
  )
}

const VotingButtons = ({ complaint }) => {
  const [userVote, setUserVote] = useState(null)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType) => {
    if (isVoting) return
    setIsVoting(true)
    setTimeout(() => {
      setUserVote(voteType)
      setIsVoting(false)
    }, 500)
  }

  const totalVotes = complaint.votes.yes + complaint.votes.no
  const yesPercentage = totalVotes > 0 ? (complaint.votes.yes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (complaint.votes.no / totalVotes) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <motion.button
          onClick={() => handleVote("yes")}
          disabled={isVoting || userVote}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg ${
            userVote === "yes"
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200"
              : userVote === "no"
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 hover:shadow-xl hover:-translate-y-1"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <CheckCircle className="w-5 h-5" />
          {isVoting && userVote !== "yes" ? (
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            "👍 Serious Issue!"
          )}
        </motion.button>

        <motion.button
          onClick={() => handleVote("no")}
          disabled={isVoting || userVote}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg ${
            userVote === "no"
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-200"
              : userVote === "yes"
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-2 border-red-200 hover:from-red-100 hover:to-pink-100 hover:border-red-300 hover:shadow-xl hover:-translate-y-1"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <XCircle className="w-5 h-5" />
          {isVoting && userVote !== "no" ? (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            "👎 Not Priority"
          )}
        </motion.button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-semibold text-gray-700">
          <span>🏫 Campus Community ({totalVotes} votes)</span>
          <span className="text-blue-600">{yesPercentage.toFixed(0)}% agree this needs fixing!</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div className="flex h-full">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700 shadow-sm"
              style={{ width: `${yesPercentage}%` }}
            />
            <div
              className="bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-700 shadow-sm"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm font-medium">
          <span className="flex items-center gap-2 text-green-600">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm" />
            {complaint.votes.yes} Students Agree
          </span>
          <span className="flex items-center gap-2 text-red-600">
            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-sm" />
            {complaint.votes.no} Students Disagree
          </span>
        </div>
      </div>

      {userVote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-sm font-bold py-3 px-4 rounded-xl ${
            userVote === "yes"
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
              : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800"
          }`}
        >
          🎉 Thanks for your vote! Your voice helps improve our campus!
        </motion.div>
      )}
    </div>
  )
}

const ComplaintDetails = () => {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching complaint details
    const fetchComplaint = () => {
      let foundComplaint = SAMPLE_COMPLAINTS.find((c) => c.id === Number.parseInt(id))

      // If not found in original complaints, check user complaints (ID range 100+)
      if (!foundComplaint && Number.parseInt(id) >= 100) {
        const userComplaintIndex = Number.parseInt(id) - 100
        if (userComplaintIndex < SAMPLE_COMPLAINTS.length) {
          foundComplaint = {
            ...SAMPLE_COMPLAINTS[userComplaintIndex],
            id: Number.parseInt(id), // Keep the modified ID
            submittedBy: "You", // Mark as user's own complaint
            isOwn: true,
          }
        }
      }

      if (foundComplaint) {
        // Enhanced complaint with detailed workflow tracking
        const enhancedComplaint = {
          ...foundComplaint,
          workflow: [
            {
              stage: "Submitted",
              status: "completed",
              timestamp: "2024-01-15T09:00:00Z",
              responsible: "Student",
              description: "Complaint submitted by student",
              icon: MessageSquare,
              color: "text-blue-600",
            },
            {
              stage: "Admin Review",
              status: foundComplaint.status === "pending" ? "current" : "completed",
              timestamp: foundComplaint.status === "pending" ? null : "2024-01-15T11:30:00Z",
              responsible: "Admin Team",
              description: "Initial review and categorization",
              icon: User,
              color: "text-purple-600",
            },
            {
              stage: "Department Assignment",
              status:
                foundComplaint.status === "in-progress"
                  ? "current"
                  : foundComplaint.status === "resolved"
                    ? "completed"
                    : "pending",
              timestamp:
                foundComplaint.status === "in-progress" || foundComplaint.status === "resolved"
                  ? "2024-01-16T14:20:00Z"
                  : null,
              responsible:
                foundComplaint.category === "Maintenance"
                  ? "Maintenance Dept"
                  : foundComplaint.category === "IT Services"
                    ? "IT Department"
                    : foundComplaint.category === "Cafeteria"
                      ? "Food Services"
                      : foundComplaint.category === "Hostel"
                        ? "Hostel Management"
                        : "Academic Office",
              description: "Assigned to relevant department for action",
              icon: Users,
              color: "text-orange-600",
            },
            {
              stage: "HOD Approval",
              status: foundComplaint.status === "resolved" ? "completed" : "pending",
              timestamp: foundComplaint.status === "resolved" ? "2024-01-17T16:45:00Z" : null,
              responsible: "Head of Department",
              description: "Department head review and approval",
              icon: CheckCircle,
              color: "text-green-600",
            },
            {
              stage: "Resolution",
              status: foundComplaint.status === "resolved" ? "completed" : "pending",
              timestamp: foundComplaint.status === "resolved" ? "2024-01-18T09:15:00Z" : null,
              responsible: "Implementation Team",
              description: "Issue resolved and verified",
              icon: CheckCircle,
              color: "text-green-600",
            },
          ],
          updates: [
            {
              id: 1,
              message: "Your complaint has been received and assigned ID #" + foundComplaint.id,
              timestamp: "2024-01-15T09:00:00Z",
              type: "system",
              author: "System",
            },
            {
              id: 2,
              message: "Complaint reviewed and categorized under " + foundComplaint.category,
              timestamp: "2024-01-15T11:30:00Z",
              type: "admin",
              author: "Admin Team",
            },
            ...(foundComplaint.status !== "pending"
              ? [
                  {
                    id: 3,
                    message: `Issue assigned to ${
                      foundComplaint.category === "Maintenance"
                        ? "Maintenance Department"
                        : foundComplaint.category === "IT Services"
                          ? "IT Department"
                          : foundComplaint.category === "Cafeteria"
                            ? "Food Services"
                            : foundComplaint.category === "Hostel"
                              ? "Hostel Management"
                              : "Academic Office"
                    } for investigation`,
                    timestamp: "2024-01-16T14:20:00Z",
                    type: "admin",
                    author: "Admin Team",
                  },
                ]
              : []),
            ...(foundComplaint.status === "resolved"
              ? [
                  {
                    id: 4,
                    message: "Department has completed the necessary repairs/actions",
                    timestamp: "2024-01-17T16:45:00Z",
                    type: "department",
                    author: "Department Team",
                  },
                  {
                    id: 5,
                    message: "Issue has been resolved and verified. Thank you for your patience!",
                    timestamp: "2024-01-18T09:15:00Z",
                    type: "admin",
                    author: "Admin Team",
                  },
                ]
              : []),
          ],
        }
        setComplaint(enhancedComplaint)
      }
      setLoading(false)
    }

    setTimeout(fetchComplaint, 500) // Simulate loading
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return "Pending"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStageIcon = (stage) => {
    switch (stage.status) {
      case "completed":
        return <CheckCircle className={`w-6 h-6 ${stage.color}`} />
      case "current":
        return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
      case "pending":
        return <AlertCircle className="w-6 h-6 text-gray-400" />
      default:
        return <XCircle className="w-6 h-6 text-red-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading complaint details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Not Found</h2>
            <p className="text-gray-600 mb-6">The complaint you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/my-complaints"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Back to My Complaints
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/my-complaints"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Complaints
          </Link>
          <div className="text-gray-400">•</div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Details</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Complaint Info */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{complaint.title}</h2>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(complaint.submittedAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {complaint.submittedBy}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      ID: #{complaint.id}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <StatusTag status={complaint.status} />
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {complaint.category}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">{complaint.description}</p>
              </div>

              {/* Voting Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Support</h3>
                <VotingButtons complaint={complaint} />
              </div>
            </motion.div>

            {/* Workflow Timeline */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Administrative Workflow</h3>

              <div className="space-y-6">
                {complaint.workflow.map((stage, index) => (
                  <div key={stage.stage} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-3 rounded-full ${
                          stage.status === "completed"
                            ? "bg-green-100"
                            : stage.status === "current"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                        }`}
                      >
                        {getStageIcon(stage)}
                      </div>
                      {index < complaint.workflow.length - 1 && (
                        <div
                          className={`w-0.5 h-12 mt-2 ${stage.status === "completed" ? "bg-green-300" : "bg-gray-300"}`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`font-semibold ${
                            stage.status === "completed"
                              ? "text-green-700"
                              : stage.status === "current"
                                ? "text-blue-700"
                                : "text-gray-500"
                          }`}
                        >
                          {stage.stage}
                        </h4>
                        <span className="text-sm text-gray-500">{formatDate(stage.timestamp)}</span>
                      </div>

                      <p className="text-gray-600 mb-2">{stage.description}</p>
                      <p className="text-sm text-gray-500">
                        <strong>Responsible:</strong> {stage.responsible}
                      </p>

                      {stage.status === "current" && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-blue-700 text-sm font-medium">
                            🔄 Currently in progress - Expected completion within 2-3 business days
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <StatusTag status={complaint.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-blue-600">{complaint.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority</span>
                  <span
                    className={`font-medium ${
                      (complaint.votes.yes / (complaint.votes.yes + complaint.votes.no)) > 0.8
                        ? "text-red-600"
                        : complaint.votes.yes / (complaint.votes.yes + complaint.votes.no) > 0.6
                          ? "text-orange-600"
                          : "text-green-600"
                    }`}
                  >
                    {complaint.votes.yes / (complaint.votes.yes + complaint.votes.no) > 0.8
                      ? "High"
                      : complaint.votes.yes / (complaint.votes.yes + complaint.votes.no) > 0.6
                        ? "Medium"
                        : "Low"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">College</span>
                  <span className="font-medium text-gray-900">{complaint.college}</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Updates */}
            <motion.div
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
              <div className="space-y-4">
                {complaint.updates
                  .slice(-3)
                  .reverse()
                  .map((update) => (
                    <div key={update.id} className="border-l-2 border-blue-200 pl-4 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{update.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(update.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{update.message}</p>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetails
