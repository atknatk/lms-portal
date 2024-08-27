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

  
  if (process.env.ENV != 'development') {
    if (nextUrl.pathname === '/' && process.env.ENV != 'development') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard/rosa', nextUrl.origin));
      } else {
        return NextResponse.redirect('https://abcenglishonline.com/signin');
      }
    }
  
   // Protect specific routes
   if (process.env.ENV != 'development' && (nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/search'))) {
    if (!isAuthenticated) {
      return NextResponse.redirect('https://abcenglishonline.com/signin');
    }
  }
  }
  

  // Handle root path redirects
  

  // Allow access if authenticated or if path is not protected
  return NextResponse.next();
});

export const config = { matcher: ['/dashboard/:path*','/search/:path*', '/'] };