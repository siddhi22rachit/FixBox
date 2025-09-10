"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, User, Tag, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

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

const VotingButtons = ({ complaint, onVote }) => {
  const [userVote, setUserVote] = useState(null)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType) => {
    if (isVoting) return

    setIsVoting(true)
    setTimeout(() => {
      setUserVote(voteType)
      onVote(complaint.id, voteType)
      setIsVoting(false)
    }, 500)
  }

  const totalVotes = complaint.votes.yes + complaint.votes.no
  const yesPercentage = totalVotes > 0 ? (complaint.votes.yes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (complaint.votes.no / totalVotes) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Voting Buttons */}
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

      {/* Vote Results */}
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

const ComplaintCard = ({ complaint, onVote, showVoting = true, compact = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPriorityColor = () => {
    const totalVotes = complaint.votes.yes + complaint.votes.no
    const yesPercentage = totalVotes > 0 ? (complaint.votes.yes / totalVotes) * 100 : 0

    if (yesPercentage >= 80) return "text-red-600"
    if (yesPercentage >= 60) return "text-orange-600"
    return "text-yellow-600"
  }

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{complaint.title}</h3>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{complaint.submittedBy}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-medium">{formatDate(complaint.submittedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <StatusTag status={complaint.status} />
          <div
            className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-red-100 ${getPriorityColor()}`}
          >
            <TrendingUp className="w-4 h-4" />
            High Priority
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="flex items-center gap-3 mb-6">
        <Tag className="w-5 h-5 text-indigo-600" />
        <span className="text-sm font-bold text-indigo-700 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full border border-indigo-200">
          📚 {complaint.category}
        </span>
      </div>

      {/* Description */}
      <p className={`text-gray-700 mb-8 leading-relaxed font-medium ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
        {complaint.description}
      </p>

      {/* Voting Section */}
      {showVoting && <VotingButtons complaint={complaint} onVote={onVote} />}

      {/* Compact Stats */}
      {compact && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm font-semibold text-gray-600">
            <span className="bg-blue-100 px-3 py-1 rounded-full">{complaint.votes.yes + complaint.votes.no} votes</span>
            <span className="bg-green-100 px-3 py-1 rounded-full text-green-700">
              {Math.round((complaint.votes.yes / (complaint.votes.yes + complaint.votes.no)) * 100)}% support
            </span>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            View Details →
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default ComplaintCard
