// Static data for the application
export const COLLEGES = [
  "MIT College of Engineering",
  "Stanford University",
  "Harvard University",
  "IIT Bombay",
  "IIT Delhi",
  "University of California Berkeley",
  "Carnegie Mellon University",
  "Georgia Institute of Technology",
]

export const COMPLAINT_CATEGORIES = [
  "Maintenance",
  "Academics",
  "Hostel",
  "Library",
  "Cafeteria",
  "Sports",
  "Transportation",
  "Administration",
  "IT Services",
  "Other",
]

export const COMPLAINT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
}

export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
}

// Sample complaints data
export const SAMPLE_COMPLAINTS = [
  {
    id: 1,
    title: "Broken AC in Computer Lab",
    description:
      "The air conditioning system in Computer Lab 101 has been malfunctioning for the past week, making it difficult to concentrate during programming sessions.",
    category: "Maintenance",
    status: "pending",
    votes: { yes: 45, no: 3 },
    submittedBy: "John Doe",
    submittedAt: "2024-01-15",
    college: "MIT College of Engineering",
  },
  {
    id: 2,
    title: "Library WiFi Issues",
    description:
      "The WiFi connection in the main library is extremely slow and frequently disconnects, affecting students' research work.",
    category: "IT Services",
    status: "in-progress",
    votes: { yes: 67, no: 8 },
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-14",
    college: "MIT College of Engineering",
  },
  {
    id: 3,
    title: "Cafeteria Food Quality",
    description:
      "The quality of food served in the main cafeteria has deteriorated significantly. Many students have reported stomach issues.",
    category: "Cafeteria",
    status: "pending",
    votes: { yes: 89, no: 12 },
    submittedBy: "Mike Johnson",
    submittedAt: "2024-01-13",
    college: "MIT College of Engineering",
  },
  {
    id: 4,
    title: "Hostel Hot Water Problem",
    description:
      "Hot water supply in Hostel Block A has been irregular for the past month, especially during morning hours.",
    category: "Hostel",
    status: "resolved",
    votes: { yes: 34, no: 5 },
    submittedBy: "Sarah Wilson",
    submittedAt: "2024-01-10",
    college: "MIT College of Engineering",
  },
  {
    id: 5,
    title: "Outdated Lab Equipment",
    description:
      "The physics lab equipment is outdated and many instruments are not functioning properly, affecting practical sessions.",
    category: "Academics",
    status: "pending",
    votes: { yes: 56, no: 7 },
    submittedBy: "David Brown",
    submittedAt: "2024-01-12",
    college: "MIT College of Engineering",
  },
]
