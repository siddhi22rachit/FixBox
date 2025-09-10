"use client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { AuthProvider } from "./hooks/useAuth"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ReportIssue from "./pages/ReportIssue"
import MyComplaints from "./pages/MyComplaints"
import ComplaintDetails from "./pages/ComplaintDetails"
import Profile from "./pages/Profile"
import "./styles/globals.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/my-complaints" element={<MyComplaints />} />
              <Route path="/complaint/:id" element={<ComplaintDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
