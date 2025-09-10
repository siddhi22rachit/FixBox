import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle, Users, TrendingUp, Shield, Zap } from "lucide-react"
import { COLLEGES, SAMPLE_COMPLAINTS } from "../data/mockData"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Home = () => {
  const stats = [
    { icon: Users, label: "Active Users", value: "10,000+" },
    { icon: CheckCircle, label: "Issues Resolved", value: "8,500+" },
    { icon: TrendingUp, label: "Success Rate", value: "94%" },
    { icon: Shield, label: "Colleges Connected", value: "50+" },
  ]

  const features = [
    {
      icon: Zap,
      title: "Instant Reporting",
      description: "Report issues instantly with our streamlined interface",
    },
    {
      icon: Users,
      title: "Community Voting",
      description: "Let the community prioritize issues through democratic voting",
    },
    {
      icon: TrendingUp,
      title: "Real-time Tracking",
      description: "Track your complaints from submission to resolution",
    },
    {
      icon: Shield,
      title: "Transparent Process",
      description: "Complete transparency in the grievance redressal process",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">FixBox</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Smart Grievance Redressal System for College Campus
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Empowering students and faculty to report, vote, and resolve campus issues through a transparent and
              efficient digital platform.
            </p>

            <div className="mb-12">
              <img
                src="/student-tech-issues.png"
                alt="Students reporting campus issues"
                className="mx-auto rounded-lg shadow-lg max-w-md"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Login to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="bg-background rounded-lg p-6 shadow-sm border">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose FixBox?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform revolutionizes campus grievance management with user-centric design and transparent
              processes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center">
                <div className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Top Priority Issues</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These are the most critical issues currently affecting our campus community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SAMPLE_COMPLAINTS.slice(0, 3).map((issue, index) => (
              <div key={issue.id} className="bg-background rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium">
                    HIGH PRIORITY
                  </span>
                  <span className="text-sm text-muted-foreground">#{issue.category}</span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">{issue.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{issue.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {Math.round((issue.votes.yes / (issue.votes.yes + issue.votes.no)) * 100)}% Support
                  </span>
                  <span className="text-muted-foreground">{issue.votes.yes + issue.votes.no} votes</span>
                </div>

                <div className="bg-muted rounded-full h-2 mt-3">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(issue.votes.yes / (issue.votes.yes + issue.votes.no)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/dashboard"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              Vote on All Issues
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Leading Institutions</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of students and faculty from top colleges who trust FixBox.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COLLEGES.slice(0, 8).map((college, index) => (
              <div key={college.id} className="bg-primary-foreground/10 rounded-lg p-4 text-center">
                <p className="font-medium text-sm">{college.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Transform Your Campus?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the revolution in campus grievance management. Start reporting, voting, and resolving issues today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
