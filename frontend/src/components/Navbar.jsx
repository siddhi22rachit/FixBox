"use client"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, FileText, Plus, User, LogOut, Menu, X, Bell, Settings } from "lucide-react"
import { useAuth } from "../hooks/useAuth.jsx"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigationLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "My Complaints", path: "/my-complaints", icon: FileText },
    { name: "Report Issue", path: "/report-issue", icon: Plus },
    { name: "Profile", path: "/profile", icon: User },
  ]

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">FixBox</span>
              <div className="text-xs text-muted-foreground -mt-1">Smart Grievance System</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* College Name */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-foreground">{user?.college}</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-all duration-200"
              >
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-foreground">{user?.name}</div>
                  <div className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    {user?.role}
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border py-2"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <div className="text-sm font-semibold text-foreground">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Preferences
                  </Link>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border py-4"
          >
            <div className="space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground border-t border-border mt-4 pt-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {user?.college}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
