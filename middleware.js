import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth.js';

export function middleware(request) {
  // Define protected routes
  const protectedPaths = ['/dashboard', '/grievance', '/profile'];
  const authPaths = ['/login', '/register'];
  
  const { pathname } = request.nextUrl;
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  
  if (isProtectedPath) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Add user info to headers for use in pages
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.id);
    response.headers.set('x-user-role', payload.role);
    response.headers.set('x-user-email', payload.email);
    return response;
  }

  if (isAuthPath && token) {
    // Verify token
    const payload = verifyToken(token);
    if (payload) {
      // Redirect to dashboard if user is already logged in
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/grievance/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};