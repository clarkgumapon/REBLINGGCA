import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/' || 
    path === '/login' || 
    path === '/register' || 
    path === '/forgot-password' || 
    path === '/about' || 
    path === '/contact'

  // Check if path is one of the protected areas
  const isAdminPath = path.startsWith('/admin')
  const isStaffPath = path.startsWith('/staff')
  const isMemberPath = path.startsWith('/member')
  
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value
  
  // If it's a public path and the user is logged in, allow access
  if (isPublicPath && token) {
    return NextResponse.next()
  }
  
  // If it's a public path and the user is not logged in, allow access
  if (isPublicPath && !token) {
    return NextResponse.next()
  }
  
  // If it's a protected path and the user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // For protected paths with a token, we'd normally verify the role here,
  // but we'll need to check this on the client side since we can't 
  // decode the JWT token easily in middleware without extra dependencies.
  // The backend API will still enforce proper authorization.
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 