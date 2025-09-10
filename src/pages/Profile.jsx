"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Award,
  TrendingUp,
  FileText,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "../hooks/useAuth.jsx"
import { COLLEGES, USER_ROLES } from "../utils/constants"
import Navbar from "../components/Navbar"

const Profile = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    college: user?.college || "",
    department: user?.department || "",
    bio: user?.bio || "",
  })

  // Mock user stats
  const userStats = {
    complaintsSubmitted: 12,
    complaintsResolved: 8,
    votesGiven: 45,
    helpfulVotes: 32,
    memberSince: "September 2023",
    reputation: 85,
  }

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...user,
        ...editData,
      }
      login(updatedUser)
      setIsEditing(false)
      setLoading(false)
    }, 1000)
  }

  const handleCancel = () => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
      college: user?.college || "",
      department: user?.department || "",
      bio: user?.bio || "",
    })
    setIsEditing(false)
  }

  const getReputationColor = (reputation) => {
    if (reputation >= 80) return "text-green-600"
    if (reputation >= 60) return "text-blue-600"
    if (reputation >= 40) return "text-yellow-600"
    return "text-gray-600"
  }

  const getReputationBadge = (reputation) => {
    if (reputation >= 80) return "Expert Contributor"
    if (reputation >= 60) return "Active Member"
    if (reputation >= 40) return "Contributing Member"
    return "New Member"
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Basic Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <GraduationCap className="w-4 h-4" />
                      <span className="capitalize">{user.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{user.college}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isEditing
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover-lift"
                  }`}
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Profile Form */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditData({ ...editData, role: USER_ROLES.STUDENT })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          editData.role === USER_ROLES.STUDENT
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-semibold">Student</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditData({ ...editData, role: USER_ROLES.TEACHER })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          editData.role === USER_ROLES.TEACHER
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <User className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-semibold">Teacher</div>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 capitalize">{user.role}</span>
                    </div>
                  )}
                </div>

                {/* College */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                  {isEditing ? (
                    <select
                      name="college"
                      value={editData.college}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    >
                      <option value="">Select your college</option>
                      {COLLEGES.map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
                      <Building className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user.college}</span>
                    </div>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={editData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science, Mechanical Engineering"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user.department || "Not specified"}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                    />
                  ) : (
                    <div className="py-3 px-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-900">{user.bio || "No bio added yet."}</span>
                    </div>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleCancel}
                      className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover-lift disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6">
            {/* Reputation Card */}
            <motion.div
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-1 ${getReputationColor(userStats.reputation)}`}>
                  {userStats.reputation}
                </div>
                <div className="text-sm text-gray-600 mb-2">Reputation Score</div>
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Shield className="w-3 h-3" />
                  {getReputationBadge(userStats.reputation)}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${userStats.reputation}%` }}
                />
              </div>

              <div className="text-xs text-gray-500 text-center">{100 - userStats.reputation} points to next level</div>
            </motion.div>

            {/* Activity Stats */}
            <motion.div
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Issues Reported</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userStats.complaintsSubmitted}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Issues Resolved</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userStats.complaintsResolved}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Votes Given</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userStats.votesGiven}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Helpful Votes</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userStats.helpfulVotes}</span>
                </div>
              </div>
            </motion.div>

            {/* Member Since */}
            <motion.div
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="text-center">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <div className="text-sm text-gray-600 mb-1">Member Since</div>
                <div className="font-semibold text-gray-900">{userStats.memberSince}</div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/report-issue")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
                >
                  Report New Issue
                </button>

                <button
                  onClick={() => navigate("/my-complaints")}
                  className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  View My Issues
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full glass-button text-blue-600 py-3 rounded-xl font-semibold"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
