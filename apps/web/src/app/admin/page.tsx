/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role ?? "user";
  if (!session || role !== "admin") {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }
  return <div className="p-6">Админ хуудас</div>;
}