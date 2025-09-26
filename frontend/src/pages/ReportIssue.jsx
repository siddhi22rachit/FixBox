
"use client" // Added 'use client' directive for Next.js 13+ if applicable

import { useState } from "react"
import { Upload, X, AlertCircle, CheckCircle, Camera, FileText, Tag } from "lucide-react"
import { useNavigate } from "react-router-dom" // Correct import for useNavigate
import { useAuth } from "../hooks/useAuth" // Correct import for useAuth

import Navbar from "../components/Navbar"
import Footer from "../components/Footer" // Assuming you have a Footer component

// Mock constants - import from your actual constants file
import { COMPLAINT_CATEGORIES } from "../utils/constants"


// Toast Component - this component is self-contained and correct
const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 max-w-md transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      )}
      <div className={`text-sm font-medium ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
        {message}
      </div>
      <button
        onClick={onClose}
        className={`ml-auto p-1 rounded-full hover:bg-opacity-20 ${
          type === 'success' ? 'hover:bg-green-600 text-green-600' : 'hover:bg-red-600 text-red-600'
        } focus:outline-none`} // Added focus:outline-none for accessibility
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}


const ReportIssue = () => {
  const { user } = useAuth() // Get the logged-in user from your auth hook
  const navigate = useNavigate() // Hook for navigation

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    priority: "Low", // Default priority
  })
  const [uploadedImages, setUploadedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // General form error message
  const [toast, setToast] = useState(null) // Toast notification state

  // Function to show toast messages
  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000) // Auto-hide after 5 seconds
  }

  // Handle input changes for form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("") // Clear general error when user starts typing
  }

  // Handle image file uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return; // No files selected

    // Check total number of images
    if (files.length + uploadedImages.length > 3) {
      setError("You can upload a maximum of 3 images.")
      return
    }

    let filesToProcess = [];
    let uploadErrors = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        uploadErrors.push(`${file.name} exceeds 5MB limit.`);
      } else if (!file.type.startsWith('image/')) {
        uploadErrors.push(`${file.name} is not an image file.`);
      }
      else {
        filesToProcess.push(file);
      }
    });

    if (uploadErrors.length > 0) {
      setError(uploadErrors.join(' ')); // Display all upload-related errors
      return;
    }


    filesToProcess.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(), // Unique ID for key prop
            file,
            preview: e.target.result, // Data URL for image preview
            name: file.name,
          },
        ])
      }
      reader.readAsDataURL(file)
    })

     // Clear file input value to allow re-uploading same file if needed
     e.target.value = null;
  }

  // Remove an uploaded image by its ID
  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true)
    setError("") // Clear previous errors

    // --- Frontend Validation ---
    if (!formData.title.trim() || !formData.category || !formData.description.trim()) {
      setError("Please fill in all required fields (Title, Category, Description).")
      setLoading(false)
      return
    }

    if (formData.title.trim().length < 10) {
      setError("Title must be at least 10 characters long.")
      setLoading(false)
      return
    }

    if (formData.description.trim().length < 20) {
      setError("Description must be at least 20 characters long.")
      setLoading(false)
      return
    }

    // Ensure user is logged in (user object and its _id are available)
    if (!user || !user._id) {
      setError("You must be logged in to report an issue. Please log in.")
      setLoading(false)
      return
    }

    // Prepare image names (in a real application, you'd upload actual image files
    // to a cloud storage service like Cloudinary, S3, Firebase Storage, etc.,
    // and then send the URLs here. For this example, we're just sending filenames).
    const imageNames = uploadedImages.map(img => img.name)

    try {
      const response = await fetch("http://localhost:5000/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if your backend requires it (e.g., JWT token)
          // "Authorization": `Bearer ${user?.token}`, // Assuming token is on the user object
        },
        body: JSON.stringify({
          studentId: user._id, // *** CRUCIAL: Use the actual MongoDB _id from the logged-in user ***
          title: formData.title.trim(),
          category: formData.category,
          priority: formData.priority,
          description: formData.description.trim(),
          images: imageNames, // Sending filenames, adjust if you upload URLs
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If response is not OK, it's an error from the server
        throw new Error(data.message || "Failed to submit grievance. Please try again.")
      }

      // If successful, show success toast
      showToast("Grievance submitted successfully! 🎉", "success")

      // Reset form fields
      setFormData({
        title: "",
        category: "",
        description: "",
        priority: "Low",
      })
      setUploadedImages([]) // Clear uploaded images

      // Redirect to the "My Complaints" page after a short delay
      setTimeout(() => {
        navigate("/my-complaints")
      }, 2000) // Give user time to see the success message

    } catch (err) {
      console.error("Error submitting grievance:", err)
      // Display error message from the caught error
      const errorMessage = err.message || "An unexpected error occurred. Please try again later."
      setError(errorMessage)
      showToast(errorMessage, "error")
    } finally {
      setLoading(false) // Always stop loading, regardless of success or failure
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex flex-col">
      <Navbar /> {/* Your Navbar component */}

      {/* Toast Notification will appear fixed at the top-right */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600">
            Help improve our campus by reporting issues that need attention. Your voice matters in making our college
            better.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-200">
          {/* General Error Message Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          <div className="space-y-8">
            {/* Issue Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-3">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Briefly describe the issue (e.g., Broken AC in Computer Lab)"
                  className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white text-lg"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Minimum 10 characters required</p>
            </div>

            {/* Category and Priority Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Select */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white appearance-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {COMPLAINT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Low", "Medium", "High"].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority })}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                        formData.priority === priority
                          ? priority === "High"
                            ? "bg-red-100 text-red-700 border-2 border-red-300"
                            : priority === "Medium"
                              ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                              : "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-gray-100 text-gray-600 border-2 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Provide a detailed description of the issue. Include when it started, how it affects you, and any other relevant information..."
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Minimum 20 characters required</p>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Supporting Images <span className="text-gray-500">(Optional)</span>
              </label>

              {/* Drag and Drop / Click to Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif" // Specify accepted image types
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">Upload Images</div>
                  <div className="text-sm text-gray-600 mb-4">
                    Drag and drop images here, or click to browse
                  </div>
                  <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                    <Upload className="w-4 h-4" />
                    Choose Files
                  </div>
                </label>
              </div>

              <p className="text-xs text-gray-500 mt-2">Maximum 3 images, 5MB each. Supported: JPG, PNG, GIF</p>

              {/* Display of Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label={`Remove image ${image.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 rounded-b-xl truncate">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/my-complaints")} // Navigate back to MyComplaints or a dashboard
                className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading} // Disable button when loading
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Issue...
                  </div>
                ) : (
                  "Submit Issue"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips for Better Issue Reports Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-amber-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Issue Reports</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-gray-900 mb-1">Be Specific</div>
                <div>Include exact locations, times, and detailed descriptions of the problem.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-gray-900 mb-1">Add Photos</div>
                <div>Visual evidence helps administration understand and prioritize issues better.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-gray-900 mb-1">Choose Right Category</div>
                <div>Proper categorization helps route your issue to the right department.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-gray-900 mb-1">Set Priority</div>
                <div>Help us understand the urgency and impact of the issue on campus life.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer /> {/* Your Footer component */}
    </div>
  )
}

export default ReportIssue