/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import UsersManager from "../../components/UsersManager";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions as any);
  const role = (session as any)?.role ?? "user";
  if (!session || role !== "admin") {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  const [usersCount, businessesCount] = await Promise.all([
    prisma.user.count(),
    prisma.business.count(),
  ]);

  return (
    <div className="min-h-screen bg-purple-700 text-purple-100 p-6">
      <h1 className="text-2xl font-bold">Админ хуудас</h1>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg bg-purple-800 p-4">
          <div className="text-sm uppercase text-purple-200">Нийт хэрэглэгчид</div>
          <div className="text-3xl font-bold">{usersCount}</div>
        </div>
        <div className="rounded-lg bg-purple-800 p-4">
          <div className="text-sm uppercase text-purple-200">Нийт газрууд</div>
          <div className="text-3xl font-bold">{businessesCount}</div>
        </div>
      </div>

      <UsersManager />
    </div>
  );
}