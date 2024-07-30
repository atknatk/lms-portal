// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req : any) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  // Handle root path redirects
  if (nextUrl.pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard/perp', nextUrl.origin));
    } else {
      return NextResponse.redirect('https://abcenglishonline.com/signin');
    }
  }

 // Protect specific routes
 if (nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/search')) {
  if (!isAuthenticated) {
    return NextResponse.redirect('https://abcenglishonline.com/signin');
  }
}



  // Allow access if authenticated or if path is not protected
  return NextResponse.next();
});

export const config = { matcher: ['/dashboard/:path*','/search/:path*', '/'] };