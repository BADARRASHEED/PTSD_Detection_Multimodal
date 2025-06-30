import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to protect dashboard routes. Redirects to the home page
 * if no `authToken` cookie is found on requests to protected paths.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run checks for the protected routes
  const isProtected =
    pathname.startsWith('/doctor-dashboard') ||
    pathname.startsWith('/admin-dashboard')

  if (isProtected) {
    const token = request.cookies.get('authToken')
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Match only the protected dashboard routes
export const config = {
  matcher: ['/doctor-dashboard/:path*', '/admin-dashboard/:path*'],
}
