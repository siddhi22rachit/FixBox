"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Search,
  Plus,
  Calendar,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { SAMPLE_COMPLAINTS, COMPLAINT_CATEGORIES } from "../utils/constants"
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

const MyComplaints = () => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Simulate user's complaints (filter by user in real app)
  useEffect(() => {
    // In a real app, this would fetch complaints for the logged-in user
    const userComplaints = SAMPLE_COMPLAINTS.map((complaint, index) => ({
      ...complaint,
      id: index + 100, // Different IDs for user complaints
      submittedBy: user?.name || "You",
      isOwn: true,
      updates: [
        {
          id: 1,
          message: "Your complaint has been received and is under review.",
          timestamp: "2024-01-15T10:30:00Z",
          type: "system",
        },
        ...(complaint.status === "in-progress"
          ? [
              {
                id: 2,
                message: "Issue has been assigned to the maintenance team for investigation.",
                timestamp: "2024-01-16T14:20:00Z",
                type: "admin",
                author: "Admin Team",
              },
            ]
          : []),
        ...(complaint.status === "resolved"
          ? [
              {
                id: 3,
                message: "Issue has been resolved. Please verify and provide feedback.",
                timestamp: "2024-01-18T09:15:00Z",
                type: "admin",
                author: "Admin Team",
              },
            ]
          : []),
      ],
    }))

    setComplaints(userComplaints)
    setFilteredComplaints(userComplaints)
  }, [user])

  // Filter and sort complaints
  useEffect(() => {
    let filtered = complaints

    if (searchQuery) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((complaint) => complaint.category === selectedCategory)
    }

    if (selectedStatus) {
      filtered = filtered.filter((complaint) => complaint.status === selectedStatus)
    }

    // Sort complaints
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.submittedAt) - new Date(a.submittedAt)
        case "oldest":
          return new Date(a.submittedAt) - new Date(b.submittedAt)
        case "most-voted":
          return b.votes.yes + b.votes.no - (a.votes.yes + a.votes.no)
        case "priority":
          const aPriority = (a.votes.yes / (a.votes.yes + a.votes.no)) * 100
          const bPriority = (b.votes.yes / (b.votes.yes + b.votes.no)) * 100
          return bPriority - aPriority
        default:
          return 0
      }
    })

    setFilteredComplaints(filtered)
  }, [complaints, searchQuery, selectedCategory, selectedStatus, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedStatus("")
    setSortBy("newest")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusStats = () => {
    const stats = {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in-progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
      rejected: complaints.filter((c) => c.status === "rejected").length,
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Complaints</h1>
            <p className="text-gray-600">Track the status and progress of your submitted issues</p>
          </div>

          <Link
            to="/report-issue"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Report New Issue
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="glass-card rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="">All Categories</option>
                {COMPLAINT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-voted">Most Voted</option>
                <option value="priority">High Priority</option>
              </select>

              {(searchQuery || selectedCategory || selectedStatus || sortBy !== "newest") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="text-gray-500 mb-4">
                {complaints.length === 0
                  ? "You haven't submitted any complaints yet."
                  : "No complaints match your search criteria."}
              </div>
              {complaints.length === 0 ? (
                <Link
                  to="/report-issue"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
                >
                  <Plus className="w-4 h-4" />
                  Report Your First Issue
                </Link>
              ) : (
                <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 font-semibold">
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                className="glass-card rounded-2xl p-6 hover-lift"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{complaint.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(complaint.submittedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {complaint.votes.yes + complaint.votes.no} votes
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {complaint.updates?.length || 0} updates
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusTag status={complaint.status} />
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {complaint.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>

                {/* Voting Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-green-600">{complaint.votes.yes}</span> agree,{" "}
                      <span className="font-medium text-red-600">{complaint.votes.no}</span> disagree
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((complaint.votes.yes / (complaint.votes.yes + complaint.votes.no)) * 100)}% support
                    </div>
                  </div>

                  <Link
                    to={`/complaint/${complaint.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MyComplaints
