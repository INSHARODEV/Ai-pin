// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function roleHome(role?: string) {
  switch (role) {
    case 'SUPERVISOR':
      return '/branch';
    case 'SELLER':
      return '/sales';
    case 'ADMIN':
      return '/admin/companies';
    default:
      return '/';
  }
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;

  // If already logged in, keep them away from /login
  if (pathname.startsWith('/login') && token) {
    const url = req.nextUrl.clone();
    url.pathname = roleHome(role);
    return NextResponse.redirect(url);
  }

  // Protect private routes
  const protectedPaths = [
    /^\/admin(?:\/|$)/,
    /^\/sales(?:\/|$)/,
    /^\/branch(?:\/|$)/,
  ];
  const isProtected = protectedPaths.some(r => r.test(pathname));

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set(
      'next',
      pathname + (searchParams ? `?${searchParams}` : '')
    );
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/sales/:path*', '/branch/:path*'],
};
