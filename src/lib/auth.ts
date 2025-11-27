import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// For production, you should use bcrypt to hash passwords
// This is a simple comparison for single admin user
const verifyPassword = (inputPassword: string, storedPassword: string) => {
  return inputPassword === storedPassword;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@pinetech.pk" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error("Admin credentials not configured in environment variables");
          return null;
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if credentials match
        if (
          credentials.email === adminEmail &&
          verifyPassword(credentials.password, adminPassword)
        ) {
          // Return user object - this gets encoded in the JWT
          return {
            id: "1",
            email: adminEmail,
            name: "Admin",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
