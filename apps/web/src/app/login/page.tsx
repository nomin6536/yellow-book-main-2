/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export default async function LoginRedirect() {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role ?? 'user';

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/login');
  }

  if (role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/');
  }
}