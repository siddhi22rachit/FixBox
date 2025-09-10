"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, TrendingUp, Users, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { SAMPLE_COMPLAINTS, COMPLAINT_CATEGORIES } from "../data/mockData"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ComplaintCard from "../components/ComplaintCard"

const Dashboard = () => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState(SAMPLE_COMPLAINTS)
  const [filteredComplaints, setFilteredComplaints] = useState(SAMPLE_COMPLAINTS)
  const [showAllComplaints, setShowAllComplaints] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let filtered = complaints

    if (searchQuery) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((complaint) => complaint.category === selectedCategory)
    }

    if (selectedStatus) {
      filtered = filtered.filter((complaint) => complaint.status === selectedStatus)
    }

    filtered.sort((a, b) => {
      const aPercentage = (a.votes.yes / (a.votes.yes + a.votes.no)) * 100
      const bPercentage = (b.votes.yes / (b.votes.yes + b.votes.no)) * 100
      return bPercentage - aPercentage
    })

    setFilteredComplaints(filtered)
  }, [complaints, searchQuery, selectedCategory, selectedStatus])

  const handleVote = (complaintId, voteType) => {
    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          return {
            ...complaint,
            votes: {
              ...complaint.votes,
              [voteType]: complaint.votes[voteType] + 1,
            },
          }
        }
        return complaint
      }),
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedStatus("")
  }

  const topComplaints = filteredComplaints.slice(0, 3)
  const displayedComplaints = showAllComplaints ? filteredComplaints : topComplaints

  const totalComplaints = complaints.length
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved").length
  const pendingComplaints = complaints.filter((c) => c.status === "pending").length
  const totalVotes = complaints.reduce((sum, c) => sum + c.votes.yes + c.votes.no, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">
            {user?.role === "teacher"
              ? "Monitor and manage campus issues reported by students."
              : "Vote on campus issues and help prioritize what needs attention."}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground mb-1">{totalComplaints}</div>
            <div className="text-sm text-muted-foreground">Total Issues</div>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground mb-1">{resolvedComplaints}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground mb-1">{pendingComplaints}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground mb-1">{totalVotes}</div>
            <div className="text-sm text-muted-foreground">Total Votes</div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border">
          <h2 className="text-lg font-semibold text-foreground mb-3">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div>
                <div className="font-medium text-foreground mb-1">Review Issues</div>
                <div>Browse through campus issues reported by students and faculty.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div>
                <div className="font-medium text-foreground mb-1">Vote & Prioritize</div>
                <div>Vote on whether issues are serious and need immediate attention.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div>
                <div className="font-medium text-foreground mb-1">Track Progress</div>
                <div>Monitor the status of issues as they get resolved by administration.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {showAllComplaints ? "All Campus Issues" : "Top Priority Issues"}
            </h2>
            <p className="text-muted-foreground">
              {showAllComplaints
                ? `Showing ${filteredComplaints.length} of ${complaints.length} issues`
                : "Most urgent issues that need your attention"}
            </p>
          </div>

          {!showAllComplaints && (
            <button
              onClick={() => setShowAllComplaints(true)}
              className="bg-card hover:bg-accent text-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2 border shadow-sm transition-colors"
            >
              View All Issues
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {showAllComplaints && (
          <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search issues, descriptions, or submitters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  showFilters || selectedCategory || selectedStatus
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent text-foreground border"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
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
                  className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {displayedComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onVote={handleVote}
              showVoting={user?.role === "student" || user?.role === "teacher"}
            />
          ))}
        </div>

        {!showAllComplaints && filteredComplaints.length > 3 && (
          <div className="text-center">
            <button
              onClick={() => setShowAllComplaints(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              View All {complaints.length} Issues
            </button>
          </div>
        )}

        {showAllComplaints && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllComplaints(false)}
              className="bg-card hover:bg-accent text-foreground px-8 py-4 rounded-lg font-semibold border transition-colors"
            >
              Back to Top Issues
            </button>
          </div>
        )}

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No issues found matching your criteria.</div>
            <button onClick={clearFilters} className="text-primary hover:text-primary/80 font-semibold">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard
