"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, ArrowLeft, CheckCircle } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { COLLEGES, USER_ROLES } from "../utils/constants"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    college: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleNextStep = () => {
    // Validate step 1
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!formData.email.includes("@") || !formData.email.includes(".edu")) {
      setError("Please use your college email ID (@college.edu)")
      return
    }

    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate step 2
    if (!formData.role || !formData.college) {
      setError("Please select your role and college")
      setLoading(false)
      return
    }

    // Simulate registration process
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        college: formData.college,
        createdAt: new Date().toISOString(),
      }

      register(userData)
      navigate("/dashboard")
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Register Card */}
        <div className="bg-card rounded-2xl p-8 shadow-2xl border border-amber-200">
          <div className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Join FixBox
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Create your account to start reporting issues
            </motion.p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1 ? "bg-amber-700 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <div className={`w-12 h-1 rounded ${step >= 2 ? "bg-amber-700" : "bg-muted"}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2 ? "bg-amber-700 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.name@college.edu"
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-12 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-12 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: USER_ROLES.STUDENT })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.role === USER_ROLES.STUDENT
                          ? "border-amber-600 bg-amber-50 text-amber-700"
                          : "border-input hover:border-muted-foreground"
                      }`}
                    >
                      <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold">Student</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: USER_ROLES.TEACHER })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.role === USER_ROLES.TEACHER
                          ? "border-amber-600 bg-amber-50 text-amber-700"
                          : "border-input hover:border-muted-foreground"
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold">Teacher</div>
                    </button>
                  </div>
                </div>

                {/* College Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Your College</label>
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background"
                    required
                  >
                    <option value="">Choose your college</option>
                    {COLLEGES.map((college) => (
                      <option key={college} value={college}>
                        {college}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-input hover:border-muted-foreground text-foreground py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Login Link */}
          <motion.div
            className="text-center mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
