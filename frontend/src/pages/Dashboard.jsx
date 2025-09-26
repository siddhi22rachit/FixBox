"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, ChevronDown, TrendingUp, Users, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react"
import { useAuth } from "../hooks/useAuth.jsx"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ComplaintCard from "../components/ComplaintCard"

const Dashboard = () => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [showAllComplaints, setShowAllComplaints] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Function to calculate weighted score (High=3, Medium=2, Low=1)
  const calculateWeightedScore = (votes) => {
    const high = votes.High || 0
    const medium = votes.Medium || 0
    const low = votes.Low || 0
    return (high * 3) + (medium * 2) + (low * 1)
  }

  // Function to fetch grievances from the API
  const fetchGrievances = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/grievances");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching grievances:", err);
      setError("Failed to load issues. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  useEffect(() => {
    let filtered = complaints;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.studentId?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort by weighted score (highest priority first)
    filtered.sort((a, b) => {
      const aScore = calculateWeightedScore(a.votes)
      const bScore = calculateWeightedScore(b.votes)
      
      if (aScore !== bScore) {
        return bScore - aScore // Higher score first
      }
      
      // If scores are equal, sort by date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt)
    });

    setFilteredComplaints(filtered)
  }, [complaints, searchQuery])

  const handleVote = async (complaintId, voteType) => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/grievances/${complaintId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote: voteType }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cast vote: ${response.statusText}`);
      }

      fetchGrievances();
    } catch (err) {
      console.error("Error casting vote:", err);
      setError("Failed to cast vote. Please try again.");
    }
  }

  const handleDelete = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this grievance? This action cannot be undone.")) {
      return;
    }

    setDeletingId(complaintId);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/grievances/${complaintId}`, {
        method: "DELETE",
        headers: {},
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete grievance: ${response.statusText}`);
      }

      setComplaints(prevComplaints => prevComplaints.filter(c => c._id !== complaintId));
      console.log(`Grievance ${complaintId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting grievance:", err);
      setError(err.message || "Failed to delete grievance. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const topComplaints = filteredComplaints.slice(0, 4) // Show top 4 instead of 3
  const displayedComplaints = showAllComplaints ? filteredComplaints : topComplaints

  const totalComplaints = complaints.length
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved").length
  const pendingComplaints = complaints.filter((c) => c.status === "pending").length
  
  const totalVotes = complaints.reduce((sum, c) => 
    sum + (c.votes.Low || 0) + (c.votes.Medium || 0) + (c.votes.High || 0), 0
  );

  const totalWeightedScore = complaints.reduce((sum, c) => sum + calculateWeightedScore(c.votes), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading campus issues...</p>
        </div>
      </div>
    );
  }

  if (error && !deletingId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading Issues</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchGrievances}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">
            {user?.role === "teacher"
              ? "Monitor and manage campus issues reported by students."
              : "Vote on campus issues and help prioritize what needs attention."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalComplaints}</p>
                <p className="text-sm text-muted-foreground">Total Issues</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingComplaints}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{resolvedComplaints}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalVotes}</p>
                <p className="text-sm text-muted-foreground">Community Votes</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-card rounded-xl p-6 mb-8 shadow-sm border">
          <h2 className="text-lg font-semibold text-foreground mb-4">How Priority Ranking Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div>
                <div className="font-medium text-foreground mb-1">High Priority Vote</div>
                <div>Each high priority vote adds 3 points to the issue's ranking score.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div>
                <div className="font-medium text-foreground mb-1">Medium Priority Vote</div>
                <div>Each medium priority vote adds 2 points to the issue's ranking score.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div>
                <div className="font-medium text-foreground mb-1">Low Priority Vote</div>
                <div>Each low priority vote adds 1 point to the issue's ranking score.</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Total Priority Score: {totalWeightedScore} points</span> - 
              Issues are automatically ranked by their community-voted priority scores, with the most critical issues appearing first.
            </p>
          </div>
        </div>

        {/* Header with Search */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {showAllComplaints ? "All Campus Issues" : "Top Priority Issues"}
            </h2>
            <p className="text-muted-foreground">
              {showAllComplaints
                ? `Showing ${filteredComplaints.length} of ${complaints.length} issues ranked by priority score`
                : "Top 4 highest priority issues based on community votes"}
            </p>
          </div>

          {!showAllComplaints && filteredComplaints.length > 4 && (
            <button
              onClick={() => setShowAllComplaints(true)}
              className="bg-card hover:bg-accent text-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2 border shadow-sm transition-colors"
            >
              View More Issues
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-card rounded-lg p-4 mb-6 shadow-sm border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search issues by title, description, or submitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && deletingId && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong className="font-bold">Error deleting grievance: </strong>
            <span>{error}</span>
          </div>
        )}

        {/* Complaints Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {displayedComplaints.length > 0 ? (
            displayedComplaints.map((complaint, index) => (
              <div key={complaint._id} className="relative">
                {/* Priority Rank Badge */}
                {!showAllComplaints && index < 4 && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-red-500' : 
                      index === 1 ? 'bg-orange-500' : 
                      index === 2 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
                      #{index + 1}
                    </div>
                  </div>
                )}
                
                <ComplaintCard
                  complaint={complaint}
                  onVote={handleVote}
                  showVoting={user?.role === "student" || user?.role === "teacher"}
                />
                
                {/* Priority Score Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700 border">
                  Score: {calculateWeightedScore(complaint.votes)}
                </div>
                
                {(user?.role === "teacher" || user?.role === "admin") && (
                  <button
                    onClick={() => handleDelete(complaint._id)}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deletingId === complaint._id}
                    title="Delete Grievance"
                  >
                    {deletingId === complaint._id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="lg:col-span-2 text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "No issues match your search." : "No issues to display."}
              </p>
              {searchQuery && (
                <button onClick={clearSearch} className="text-primary hover:text-primary/80 font-semibold mt-4">
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* View Toggle Buttons */}
        {!showAllComplaints && filteredComplaints.length > 4 && (
          <div className="text-center">
            <button
              onClick={() => setShowAllComplaints(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              View All {filteredComplaints.length} Issues
            </button>
          </div>
        )}

        {showAllComplaints && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllComplaints(false)}
              className="bg-card hover:bg-accent text-foreground px-8 py-4 rounded-lg font-semibold border transition-colors"
            >
              Back to Top 4 Issues
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard