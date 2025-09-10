import connectDB from '../../../lib/db.js';
import User from '../../../lib/models/User.js';
import { generateToken, createAuthCookie } from '../../../lib/auth.js';
import { validateRegistrationData } from '../../../utils/validation.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST method.',
    });
  }

  try {
    // Connect to database
    await connectDB();

    // Get data from request body
    const { name, email, password, role = 'student', studentId, department, year } = req.body;

    // Validate input data
    const validation = validateRegistrationData({ name, email, password, role });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user data object
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role,
    };

    // Add student-specific fields if role is student
    if (role === 'student') {
      if (studentId) userData.studentId = studentId.trim();
      if (department) userData.department = department.trim();
      if (year) userData.year = parseInt(year);
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Set HTTP-only cookie
    const cookie = createAuthCookie(token);
    res.setHeader('Set-Cookie', cookie);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department,
          year: user.year,
          createdAt: user.createdAt,
        },
        token, // Include token in response for testing
      },
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Handle validation errors from mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}