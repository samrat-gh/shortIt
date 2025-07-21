import type { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      password?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not set");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is not set");
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: {},
      },
      async authorize(credentials) {
        const cookieStore = await cookies();

        if (!credentials?.email || !credentials?.password) {
          console.log("creds are null");
          return null;
        }

        const res = await fetch(`${process.env.BACKEND_URL}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          console.log("error fetching user");
        }

        const user = await res.json();
        console.log("user", user);
        if (user) {
          if (credentials.rememberMe) {
            cookieStore.set("token", `${user?.accessToken}`, {
              maxAge: 24 * 60 * 60 * 30,
            });
          } else {
            cookieStore.set("token", `${user?.accessToken}`, {
              maxAge: 2 * 60 * 60, //2 hours session
            });
          }
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;
        const cookieStore = await cookies();

        const res = await fetch(
          `${process.env.BACKEND_URL}/user/login/oauth?email=${profile?.email ?? token.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",

              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbXJhdEBnbWFpbC5jb20iLCJpZCI6ImNtYm55c2s5ZjAwMDB2Y3RkaGJ4cHhtaXQiLCJpYXQiOjE3NDk3NDkzNDEsImV4cCI6MTc0OTgzNTc0MX0.sG-N7LOr7EYlcuACdZRnL9a98dPv8Xwus2c0yUdVFUI",
            },
          },
        );

        if (!res.ok) {
          console.log("error fetching user");
        }

        const user = await res.json();
        console.log("user google", user);

        if (user.success === false) {
          // console.log("this is profile ", profile);
          // console.log("this is token ", token);
          // console.log("this is account ", account);
          // console.log("this is user", user);

          const register = await fetch(
            `${process.env.BACKEND_URL}/user/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nzme: token.name,
                email: profile?.email,
                password: null,
                accountType: "google",
              }),
            },
          );

          if (!register.ok) {
            console.log("error fetching user");
          }

          const registeredUser = await register.json();
          console.log("registered", registeredUser);

          if (registeredUser.accessToken) {
            cookieStore.set("token", `${user?.accessToken}`, {
              maxAge: 24 * 60 * 60 * 30,
            });
          }
        }

        if (user) {
          cookieStore.set("token", `${user?.accessToken}`, {
            maxAge: 24 * 60 * 60 * 30,
          });
          return user;
        }
        return null;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // session.accessToken = token.accessToken as string;
      const cookieStore = await cookies();

      const accessToken = cookieStore.get("token")?.value;
      // console.log("token2", token.user);
      // console.log("token1", accessToken);
      // console.log("Bearer", `Bearer ${accessToken ?? token.user}`);

      if (token.user) {
        const res = await fetch(`${process.env.BACKEND_URL}/user/details`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken ?? token.user}`,
          },
        });

        if (!res.ok) {
          console.log("user fetch failed");
        }

        const user = await res.json();
        console.log("returned user", user);
        session.user = token.user;
        return {
          ...session,
          user: {
            ...user.data,
          },
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;
