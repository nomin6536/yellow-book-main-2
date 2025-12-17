export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' },
    select: { id: true, name: true, email: true, image: true, role: true },
  });
  return NextResponse.json(users);
}