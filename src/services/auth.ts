import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
            {
              username: credentials?.username,
              password: credentials?.password,
              fcm_token: "",
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = res.data;

          if (user && res.status === 200) {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
              {
                headers: {
                  Authorization: `Bearer ${user.access_token}`,
                },
              }
            );

            if (
              response.status === 200 &&
              response.data.data.type_user !== "admin"
            ) {
              throw new Error("Anda tidak memiliki akses sebagai admin");
            }

            return {
              id: user.id,
              name: user.name,
              access_token: user.access_token,
              token_type: user.token_type,
              expires_in: user.expires_in,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Login Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.access_token = user.access_token;
        token.token_type = user.token_type;
        token.expires_in = user.expires_in;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        token_type: token.token_type as string,
        access_token: token.access_token as string,
        expires_in: token.expires_in as string,
        email: token.email as string,
        emailVerified: token.emailVerified as Date,
      };
      session.expires = token.expires_in as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
