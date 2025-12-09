import { NextResponse } from 'next/server';

export function middleware() {
  const res = NextResponse.next();
  // Route protection is primarily handled in the client-side layout to support
  // Supabase client-side sessions without forcing SSR package dependency.
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/settings/:path*', '/orgs/:path*'],
};
