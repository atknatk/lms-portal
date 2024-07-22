import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

const authConfig = {
  trustHost: true,
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID ?? '',
    //   clientSecret: process.env.GITHUB_SECRET ?? ''
    // }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const user = {
          id: '1',
          name: 'Kyle',
          email: credentials?.email as string
        };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  pages: {
    signIn: '/' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;


// import { NextAuthConfig, Session } from 'next-auth';
// import CredentialProvider from 'next-auth/providers/credentials';
// import FacebookProvider from "next-auth/providers/facebook"
// import GoogleProvider from "next-auth/providers/google"
// import LinkedInProvider from "next-auth/providers/linkedin"
// import { getStrapiURL } from './lib/utils';
// import { JWT } from "next-auth/jwt"
// import NextAuth, { DefaultSession, User as NextAuthUser } from 'next-auth';
// import { CustomUser } from 'next-auth';

// declare module 'next-auth' {
//   type UserSession = DefaultSession['user'];
//   interface Session {
//     strapiToken: string;
//     provider: string;
//     user: {
//       strapiUserId: string;
//       blocked: boolean;
//       role?: string;
//       picture?: string;
//     } & DefaultSession["user"]
//   }

//   interface CustomUser extends NextAuthUser {
//     strapiUserId: string;
//     blocked: boolean;
//     strapiToken: string;
//     role?: string;
//     picture?: string;
//   }

//   interface CredentialsInputs {
//     email: string;
//     password: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     strapiUserId: string;
//     strapiToken: string;
//     blocked: boolean;
//     role?: string;
//     picture?: string;
//     provider?: string;
//   }
// }
// const authConfig: NextAuthConfig = {
//   trustHost: true,
//   providers: [
//     FacebookProvider({
//       clientId: process.env.AUTH_FACEBOOK_ID!,
//       clientSecret: process.env.AUTH_FACEBOOK_SECRET!
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     LinkedInProvider({
//       clientId: process.env.LINKEDIN_CLIENT_ID!,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
//     }),
//     CredentialProvider({
//       name: 'email and password',
//       credentials: {
//         identifier: {
//           label: 'Email Or Username *',
//           type: 'text',
//         },
//         password: { label: 'Password *', type: 'password' },
//       },
//       async authorize(credentials): Promise<CustomUser | null> {
//         if (!credentials || !credentials.identifier || !credentials.password) {
//           return null
//         }
//         try {
//           const response = await fetch(`${getStrapiURL()}/api/auth/local`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               identifier: credentials.identifier,
//               password: credentials.password,
//             }),
//           })

//           if (!response.ok) {
//             const data = await response.json()
//             throw new Error(data.error.message || response.statusText)
//           }

//           const data = await response.json()
//           return {
//             id: data.user.id.toString(),
//             name: data.user.username,
//             email: data.user.email,
//             strapiUserId: data.user.id,
//             blocked: data.user.blocked,
//             strapiToken: data.jwt,
//             role: data.user.role,
//             picture: data.user.picture
//           }
//         } catch (error) {
//           console.error('Authorization error:', error)
//           return null
//         }
//       }
//     })
//   ],
//   pages: {
//     signIn: '/' //signin page
//   },
//   callbacks: {
//     async jwt({ token, account, user, profile, trigger, session }) {
//       if (trigger === 'update' && session?.username) {
//         token.name = session.username
//       }
//       if (trigger === 'update' && session?.strapiToken) {
//         token.strapiToken = session.strapiToken
//       }
//       if (account) {
//         if (account.provider === 'facebook') {
//           try {
//             const response = await fetch(
//               `${getStrapiURL()}/api/auth/${account.provider}/callback?access_token=${account.access_token}`,
//               { cache: 'no-cache' }
//             )
//             if (!response.ok) {
//               const error = await response.json()
//               throw new Error(error.error.message)
//             }
//             const data = await response.json()
//             token.strapiToken = data.jwt
//             token.strapiUserId = data.user.id
//             token.picture = data.user.picture
//             token.provider = account.provider
//             token.blocked = data.user.blocked
//             token.role = data.user.role
//           } catch (error) {
//             console.error('Facebook auth error:', error)
//             throw error
//           }
//         } else if (account.provider === 'credentials' && user) {
//           token.strapiToken = (user as CustomUser).strapiToken
//           token.strapiUserId = (user as CustomUser).strapiUserId
//           token.provider = account.provider
//           token.blocked = (user as CustomUser).blocked
//           token.picture = (user as CustomUser).picture
//           token.role = (user as CustomUser).role
//         }
//       }
//       return token
//     },
//     async session({ session, token }: { session: Session; token: JWT }) {
//       session.strapiToken = token.strapiToken
//       session.provider = token.provider ?? ''
//       session.user.strapiUserId = token.strapiUserId
//       session.user.picture = token.picture
//       session.user.blocked = token.blocked
//       session.user.role = token.role
//       return session
//     },
//   },
//   session: { strategy: "jwt" },
//   cookies: {
//     sessionToken: {
//       name: `__Secure-next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: 'lax',
//         path: '/',
//         secure: true,
//         domain: '.abcenglishonline.com' // Ana domain
//       }
//     },
//   },
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// export default authConfig;