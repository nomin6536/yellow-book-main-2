import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || (session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // Prevent deleting yourself
  if (session.user?.email) {
    const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (me?.id === params.id) {
      return NextResponse.json({ message: 'Cannot delete yourself' }, { status: 400 });
    }
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}