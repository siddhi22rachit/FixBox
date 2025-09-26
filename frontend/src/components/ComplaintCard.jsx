"use client"
import { useState } from "react"
import { Calendar, User, Tag, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle, AlertTriangle } from "lucide-react"

const StatusTag = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          text: "Pending Review",
          className: "bg-amber-50 text-amber-800 border border-amber-200",
        }
      case "in-progress":
        return {
          icon: AlertCircle,
          text: "In Progress",
          className: "bg-orange-50 text-orange-800 border border-orange-200",
        }
      case "resolved":
        return {
          icon: CheckCircle,
          text: "Resolved ✨",
          className: "bg-green-50 text-green-800 border border-green-200",
        }
      case "rejected":
        return {
          icon: XCircle,
          text: "Not Approved",
          className: "bg-red-50 text-red-800 border border-red-200",
        }
      default:
        return {
          icon: Clock,
          text: "Unknown",
          className: "bg-stone-50 text-stone-800 border border-stone-200",
        }
    }
  }

  const { icon: Icon, text, className } = getStatusConfig()

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${className}`}>
      <Icon className="w-4 h-4" />
      {text}
    </div>
  )
}

const VotingButtons = ({ complaint, onVote }) => {
  const [userVote, setUserVote] = useState(null)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType) => {
    if (isVoting || userVote) return

    setIsVoting(true)
    
    try {
      await onVote(complaint._id, voteType)
      setUserVote(voteType)
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const totalVotes = (complaint.votes.Low || 0) + (complaint.votes.Medium || 0) + (complaint.votes.High || 0)
  const highPercentage = totalVotes > 0 ? ((complaint.votes.High || 0) / totalVotes) * 100 : 0
  const mediumPercentage = totalVotes > 0 ? ((complaint.votes.Medium || 0) / totalVotes) * 100 : 0
  const lowPercentage = totalVotes > 0 ? ((complaint.votes.Low || 0) / totalVotes) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleVote("High")}
          disabled={isVoting || userVote}
          className={`flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-lg font-medium text-xs transition-all duration-200 ${
            userVote === "High"
              ? "bg-red-600 text-white"
              : userVote
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {isVoting && userVote !== "High" ? "Voting..." : "🚨 High"}
        </button>

        <button
          onClick={() => handleVote("Medium")}
          disabled={isVoting || userVote}
          className={`flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-lg font-medium text-xs transition-all duration-200 ${
            userVote === "Medium"
              ? "bg-orange-600 text-white"
              : userVote
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          {isVoting && userVote !== "Medium" ? "Voting..." : "⚠️ Medium"}
        </button>

        <button
          onClick={() => handleVote("Low")}
          disabled={isVoting || userVote}
          className={`flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-lg font-medium text-xs transition-all duration-200 ${
            userVote === "Low"
              ? "bg-green-600 text-white"
              : userVote
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          {isVoting && userVote !== "Low" ? "Voting..." : "✅ Low"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span>Priority Votes ({totalVotes} total)</span>
          <span className="text-red-700">{highPercentage.toFixed(0)}% high priority</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="flex h-full">
            <div className="bg-red-500 transition-all duration-500" style={{ width: `${highPercentage}%` }} />
            <div className="bg-orange-500 transition-all duration-500" style={{ width: `${mediumPercentage}%` }} />
            <div className="bg-green-500 transition-all duration-500" style={{ width: `${lowPercentage}%` }} />
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            {complaint.votes.High || 0} High
          </span>
          <span className="flex items-center gap-2 text-orange-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            {complaint.votes.Medium || 0} Medium
          </span>
          <span className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            {complaint.votes.Low || 0} Low
          </span>
        </div>
      </div>

      {userVote && (
        <div
          className={`text-center text-sm font-medium py-2 px-4 rounded-lg ${
            userVote === "High" 
              ? "bg-red-50 text-red-800" 
              : userVote === "Medium"
                ? "bg-orange-50 text-orange-800"
                : "bg-green-50 text-green-800"
          }`}
        >
          Thanks for rating this as {userVote} priority! Your voice helps improve our campus.
        </div>
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
    const totalVotes = (complaint.votes.Low || 0) + (complaint.votes.Medium || 0) + (complaint.votes.High || 0)
    const highPercentage = totalVotes > 0 ? ((complaint.votes.High || 0) / totalVotes) * 100 : 0

    if (highPercentage >= 60) return "text-red-600"
    if (highPercentage >= 30) return "text-orange-600"
    return "text-amber-600"
  }

  const getPriorityLevel = () => {
    const totalVotes = (complaint.votes.Low || 0) + (complaint.votes.Medium || 0) + (complaint.votes.High || 0)
    if (totalVotes === 0) return complaint.priority || "Medium"
    
    const maxVotes = Math.max(complaint.votes.Low || 0, complaint.votes.Medium || 0, complaint.votes.High || 0)
    if (maxVotes === (complaint.votes.High || 0)) return "High"
    if (maxVotes === (complaint.votes.Medium || 0)) return "Medium"
    return "Low"
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">{complaint.title}</h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{complaint.submittedBy || 'Student'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(complaint.submittedAt || complaint.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusTag status={complaint.status} />
          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-amber-50 ${getPriorityColor()}`}
          >
            <TrendingUp className="w-3 h-3" />
            {getPriorityLevel()} Priority
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-md">
          {complaint.category}
        </span>
      </div>

      {/* Description */}
      <p className={`text-muted-foreground mb-6 leading-relaxed ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
        {complaint.description}
      </p>

      {/* Voting Section */}
      {showVoting && <VotingButtons complaint={complaint} onVote={onVote} />}

      {/* Compact Stats */}
      {compact && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{(complaint.votes.Low || 0) + (complaint.votes.Medium || 0) + (complaint.votes.High || 0)} votes</span>
            <span className="text-primary">
              {getPriorityLevel()} Priority
            </span>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            View Details →
          </button>
        </div>
      )}
    </div>
  )
}

export default ComplaintCard