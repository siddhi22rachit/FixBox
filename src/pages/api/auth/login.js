import connectDB from '../../../lib/db.js';
import User from '../../../lib/models/User.js';
import { generateToken, createAuthCookie } from '../../../lib/auth.js';
import { validateLoginData } from '../../../utils/validation.js';

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
    const { email, password } = req.body;

    // Validate input data
    const validation = validateLoginData({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

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
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department,
          year: user.year,
        },
        token, // Include token in response for testing
      },
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}