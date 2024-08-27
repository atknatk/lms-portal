
import { Account, NextAuthConfig, Profile, Session } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"
import { getStrapiFetch, getStrapiURL } from './lib/utils';
import { JWT } from "next-auth/jwt"
import { DefaultSession, User as NextAuthUser } from 'next-auth';
import { CustomUser } from 'next-auth';

declare module 'next-auth' {
  type UserSession = DefaultSession['user'];
  interface Session {
    strapiToken: string;
    provider: string;
    user: {
      strapiUserId: string;
      blocked: boolean;
      role?: string;
      picture?: string;
    } & DefaultSession["user"]
  }

  interface CustomUser extends NextAuthUser {
    strapiUserId: string;
    blocked: boolean;
    strapiToken: string;
    role?: string;
    picture?: string;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiUserId: string;
    strapiToken: string;
    blocked: boolean;
    role?: string;
    picture?: string;
    provider?: string;
  }
}

// API ile iletişim kurarken fetch kullanarak Strapi'den yanıt almak
const handleProviderSignIn = async (account: any, profile:any, token:any) => {
  try {
    const url = `${getStrapiURL()}/api/auth/${account.provider}/callback?access_token=${account.access_token}`;
    const response = await fetch(url, { cache: 'no-cache' });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.message === 'Email is already taken') {
        const existingUserResponse = await fetch(`${getStrapiURL()}/users?email=${profile.email}`);
        const existingUserData = await existingUserResponse.json();
        if (existingUserData.length > 0) {
          const existingUser = existingUserData[0];
          await fetch(`${getStrapiURL()}/users/${existingUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.BACKEND_TOKEN}`
            },
            body: JSON.stringify({
              provider: account.provider,
              confirmed: true,
            })
          });

          const loginResponse = await fetch(`${getStrapiURL()}/auth/local`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: profile.email,
              password: 'YOUR_DEFAULT_PASSWORD',
            })
          });
          const loginData = await loginResponse.json();
          token.strapiToken = loginData.jwt;
          token.strapiUserId = existingUser.id;
          token.picture = existingUser.picture;
          token.provider = account.provider;
          token.blocked = existingUser.blocked;
          token.role = existingUser.role;
        } else {
          throw new Error(errorData.error.message);
        }
      }
    } else {
      const strapiLoginData = await response.json();
      token.strapiToken = strapiLoginData.jwt;
      token.strapiUserId = strapiLoginData.user.id;
      token.picture = strapiLoginData.user.picture;
      token.provider = account.provider;
      token.blocked = strapiLoginData.user.blocked;

      const roleResponse = await getStrapiFetch(`users/${token.strapiUserId}?populate=role`);
      token.role = {
        id: roleResponse.role?.id,
        name: roleResponse.role?.name,
      };
    }
  } catch (error) {
    console.error(account.provider + ' general', error);
    throw error;
  }
};


const authorizeCredentials = async (credentials: any) => {
  if(process.env.ENV == 'development'){
    return {
      name: 'Atakan Atik',
      email: 'atknatk@gmail.com',
      id: 99999,
      strapiUserId: 99999,
      blocked: false,
      strapiToken: 'userData.jwt',
      role: {
        id: 1,
        name: 'student',
      },
    }
  }

  if (!credentials || !credentials.identifier || !credentials.password) {
    return null;
  }

  
  try {
    const response = await fetch(`${getStrapiURL()}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: credentials.identifier,
        password: credentials.password,
      })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error.message);
    }

    const userData = await response.json();
    const userRoleResponse = await getStrapiFetch(`users/${userData.user.id}?populate=role`);
    return {
      name: userData.user.username,
      email: userData.user.email,
      id: userData.user.id.toString(),
      strapiUserId: userData.user.id,
      blocked: userData.user.blocked,
      strapiToken: userData.jwt,
      role: {
        id: userRoleResponse.role?.id,
        name: userRoleResponse.role?.name,
      },
    };
  } catch (error) {
    console.error('credentials General strapiError', error);
    throw error;
  }
};


const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    FacebookProvider({
      id: 'facebook',
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    GoogleProvider({
      id: 'google',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      id: 'linkedin',
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    CredentialProvider({
      name: 'email and password',
      credentials: {
        identifier: { label: 'Email Or Username *', type: 'text' },
        password: { label: 'Password *', type: 'password' },
      },
      authorize: authorizeCredentials,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (
        account &&
        account.provider === 'google' &&
        profile &&
        'email_verified' in profile
      ) {
        if (!profile.email_verified) return false;
      }
      return true;
    },
    async jwt({ token, account, user, profile, trigger, session }) {
      if (trigger === 'update' && session?.username) {
        token.name = session.username;
      }
      if (trigger === 'update' && session?.strapiToken) {
        token.strapiToken = session.strapiToken;
      }

      if (account) {
        if (account.provider === 'facebook' || account.provider === 'google') {
          await handleProviderSignIn(account, profile, token);
        } else if (account.provider === 'credentials') {
          const custumUser = (user as CustomUser);
          token.strapiToken = custumUser.strapiToken;
          token.strapiUserId = custumUser.strapiUserId;
          token.provider = account.provider;
          token.blocked = custumUser.blocked;
          token.picture = custumUser.picture;
          token.role = custumUser.role;
        }
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      const customSession : any = { ...session };
      customSession.strapiToken = token.strapiToken;
      customSession.provider = token.provider;
      customSession.user.strapiUserId = token.strapiUserId;
      customSession.user.picture = token.picture;
      customSession.user.blocked = token.blocked;
      return Promise.resolve(customSession);
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/', // Giriş sayfası
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: process.env.ENV == 'development' ? '.localhost:3000' : '.abcenglishonline.com', // Ana domain
      },
    },
  },
};


//export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export default authConfig;










