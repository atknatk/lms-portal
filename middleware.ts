// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from './src/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req : any) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  if(!isAuthenticated){
    return Response.redirect('/');
  }


  if((nextUrl.pathname == '' || nextUrl.pathname == '/')){
    if(isAuthenticated){
      return Response.redirect('/dashboard/perp');
    }else{
      return Response.redirect('https://abcenglishonline.com');
    }
  }


  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/');
    return Response.redirect(url);
  }
});

export const config = { matcher: ['/dashboard/:path*','/search/:path*'] };