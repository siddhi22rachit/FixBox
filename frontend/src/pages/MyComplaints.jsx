

"use client"
import { useState, useEffect, useCallback } from "react" // Added useCallback
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
  XCircle, // Keep XCircle just in case you add 'rejected' status later
} from "lucide-react"
import { useAuth } from "../hooks/useAuth"
// import { SAMPLE_COMPLAINTS, COMPLAINT_CATEGORIES } from "../utils/constants" // Removed SAMPLE_COMPLAINTS
import { COMPLAINT_CATEGORIES } from "../utils/constants" // Kept COMPLAINT_CATEGORIES
import Navbar from "../components/Navbar"
import Footer from "../components/Footer" // Assuming you want a Footer here too

const StatusTag = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          text: "Pending Review",
          className: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300",
        }
      case "reviewed": // Corresponds to 'in-progress' logic in the original, but uses your actual backend status
        return {
          icon: AlertCircle,
          text: "Reviewed",
          className: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300",
        }
      case "resolved":
        return {
          icon: CheckCircle,
          text: "Resolved ✨",
          className: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300",
        }
      // If you implement a 'rejected' status in your backend, you can uncomment this
      // case "rejected":
      //   return {
      //     icon: XCircle,
      //     text: "Not Approved",
      //     className: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300",
      //   }
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
  const { user } = useAuth() // Get the logged-in user
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state

  // Function to fetch grievances for the logged-in user
  const fetchUserGrievances = useCallback(async () => {
    if (!user || !user._id) {
      setLoading(false);
      // If user is not logged in, or _id is missing, clear complaints and exit
      setComplaints([]);
      setFilteredComplaints([]);
      return;
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:5000/api/grievances/user/${user._id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Add 'isOwn: true' for consistency with previous mock data structure if needed for other logic
      // and map _id to id for consistency if your component expects 'id'
      const processedComplaints = data.map(complaint => ({
        ...complaint,
        id: complaint._id, // Map MongoDB _id to 'id' for existing component logic
        submittedBy: user.name, // The backend doesn't populate user for this specific route, so we use frontend user name
        isOwn: true,
        // Mock updates, as your backend grievance schema doesn't currently include 'updates' array
        updates: [
          {
            id: 'update1',
            message: "Your complaint has been received and is under review.",
            timestamp: complaint.submittedAt,
            type: "system",
          },
          ...(complaint.status === "reviewed"
            ? [{
                id: 'update2',
                message: "Issue has been reviewed by the administration.",
                timestamp: new Date(new Date(complaint.submittedAt).getTime() + 86400000).toISOString(), // 1 day later
                type: "admin",
                author: "Admin Team",
            }]
            : []),
          ...(complaint.status === "resolved"
            ? [{
                id: 'update3',
                message: "Issue has been resolved. Please verify and provide feedback.",
                timestamp: new Date(new Date(complaint.submittedAt).getTime() + 172800000).toISOString(), // 2 days later
                type: "admin",
                author: "Admin Team",
            }]
            : []),
        ]
      }));
      setComplaints(processedComplaints);
      setFilteredComplaints(processedComplaints); // Initialize filtered with all user complaints
    } catch (err) {
      console.error("Error fetching user grievances:", err);
      setError("Failed to load your complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]); // Re-fetch if user changes (e.g., logs in/out)

  // Fetch complaints on component mount or when user changes
  useEffect(() => {
    fetchUserGrievances();
  }, [fetchUserGrievances]);

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
          // Assuming votes are stored as Low, Medium, High counts
          const aTotalVotes = (a.votes?.Low || 0) + (a.votes?.Medium || 0) + (a.votes?.High || 0);
          const bTotalVotes = (b.votes?.Low || 0) + (b.votes?.Medium || 0) + (b.votes?.High || 0);
          return bTotalVotes - aTotalVotes;
        case "priority":
            // This priority calculation was based on yes/no votes.
            // With Low/Medium/High, a simple approach could be highest 'High' votes, then 'Medium', etc.
            // Or, if your backend assigns a 'priority' field, use that.
            // For now, let's use the 'priority' field from the backend if it exists,
            // otherwise, a simplified vote-based calculation.
            const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
            const aP = priorityOrder[a.priority] || 0;
            const bP = priorityOrder[b.priority] || 0;

            if (aP !== bP) {
                return bP - aP; // Sort by priority descending
            }
            // If priorities are equal, then sort by total votes
            const aVotes = (a.votes?.Low || 0) + (a.votes?.Medium || 0) + (a.votes?.High || 0);
            const bVotes = (b.votes?.Low || 0) + (b.votes?.Medium || 0) + (b.votes?.High || 0);
            return bVotes - aVotes;
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
    if (!dateString) return "N/A";
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
      reviewed: complaints.filter((c) => c.status === "reviewed").length, // Changed from inProgress
      resolved: complaints.filter((c) => c.status === "resolved").length,
      rejected: 0, // Your backend doesn't have 'rejected' status yet
    }
    return stats
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Complaints</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchUserGrievances}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to view your complaints.</p>
          <Link
            to="/login" // Assuming '/login' is your login route
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
          >
            Log In
          </Link>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Report New Issue
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8" // Adjusted to 4 columns, since 'rejected' is 0
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-card rounded-xl p-4 text-center shadow-lg border border-amber-200">
            <div className="text-2xl font-bold text-foreground mb-1">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-lg border border-amber-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-lg border border-amber-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.reviewed}</div> {/* Changed from inProgress */}
            <div className="text-sm text-muted-foreground">Reviewed</div> {/* Changed from In Progress */}
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-lg border border-amber-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
          {/* Removed 'Rejected' card for now as it's not in your backend schema */}
          {/* If you add 'rejected' status to your backend, you can re-add this */}
          {/* <div className="bg-card rounded-xl p-4 text-center shadow-lg border border-amber-200">
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div> */}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-card rounded-2xl p-6 mb-8 shadow-lg border border-amber-200"
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
                className="w-full pl-10 pr-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
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
                className="px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option> {/* Changed from in-progress */}
                <option value="resolved">Resolved</option>
                {/* <option value="rejected">Rejected</option> If you add this status later */}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
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
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
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
                key={complaint._id} // Use MongoDB _id for key
                className="bg-card rounded-2xl p-6 shadow-lg border border-amber-200 hover:shadow-xl transition-shadow duration-300"
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
                        {(complaint.votes?.Low || 0) + (complaint.votes?.Medium || 0) + (complaint.votes?.High || 0)} votes
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {complaint.updates?.length || 0} updates {/* This relies on frontend mocking 'updates' for now */}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusTag status={complaint.status} />
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {complaint.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>

                {/* Voting Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-green-600">{(complaint.votes?.High || 0) + (complaint.votes?.Medium || 0)}</span> upvotes,{" "}
                      <span className="font-medium text-red-600">{(complaint.votes?.Low || 0)}</span> downvotes
                    </div>
                    {/* Simplified support percentage for demonstration */}
                    <div className="text-sm text-gray-600">
                        {
                            ((complaint.votes?.High || 0) + (complaint.votes?.Medium || 0) + (complaint.votes?.Low || 0)) > 0
                                ? `${Math.round(((complaint.votes?.High || 0) + (complaint.votes?.Medium || 0)) / ((complaint.votes?.High || 0) + (complaint.votes?.Medium || 0) + (complaint.votes?.Low || 0)) * 100)}% support`
                                : "No votes yet"
                        }
                    </div>
                  </div>

                  <Link
                    to={`/complaint/${complaint._id}`} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MyComplaints