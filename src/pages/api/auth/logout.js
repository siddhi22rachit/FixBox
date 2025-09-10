import { clearAuthCookie } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST method.',
    });
  }

  try {
    // Clear the authentication cookie
    const cookie = clearAuthCookie();
    res.setHeader('Set-Cookie', cookie);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });

  } catch (error) {
    console.error('Logout error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}