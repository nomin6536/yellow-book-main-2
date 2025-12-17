import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const body = await _req.json().catch(() => ({}));
  const role = body?.role as Role | undefined;
  if (!role || !['admin', 'user'].includes(role)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }

  // Prevent demoting yourself from admin
  if ((session as any).user?.email) {
    const me = await prisma.user.findUnique({ where: { email: (session as any).user.email }, select: { id: true } });
    if (me?.id === params.id && role !== 'admin') {
      return NextResponse.json({ message: 'Cannot demote yourself' }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { role },
    select: { id: true, email: true, role: true },
  });
  return NextResponse.json(updated);
}