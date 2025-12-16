/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
//NextAuth серверийн маршрут
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }: { user: { email?: string | null; name?: string | null; image?: string | null } }) {
      if (!user?.email) return false;
      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name ?? undefined, image: user.image ?? undefined },
        create: {
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          role: Role.admin,
        },
      });
      return true;
    },
    async jwt({ token }: { token: JWT }) {
      if (token.email) {
        const u = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { role: true },
        });
        (token as any).role = u?.role ?? Role.user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      (session as any).role = (token as any)?.role ?? Role.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };