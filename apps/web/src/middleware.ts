/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = (token as any)?.role ?? "user";
    if (!token || role !== "admin") {
      const signin = new URL("/api/auth/signin", req.url);
      signin.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signin);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };