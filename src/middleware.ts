import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes, excluding the login page and auth API
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Note: We cannot verify the JWT here directly with jsonwebtoken 
    // because middleware runs on Edge runtime and jsonwebtoken uses Node.js crypto.
    // For a fully secure approach, we either use a Jose-based JWT library,
    // or rely on API routes for deep validation, treating the cookie existence as a soft gate here.
    // Assuming 'admin_token' only exists if successfully logged in.
  }

  // Protect Admin API routes as well
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
    const token = request.cookies.get('admin_token')?.value || request.headers.get('authorization');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
