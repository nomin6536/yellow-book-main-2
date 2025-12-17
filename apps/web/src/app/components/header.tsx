'use client';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const role = (session as any)?.role ?? 'user';
  const isAdmin = role === 'admin';
  const authed = status === 'authenticated';

  return (
    <header className="border-b border-white/10 bg-[#201235] text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold">Yellow Books</Link>
        <nav className="ml-auto flex items-center gap-4">
          {isAdmin && (
            <Link href="/api/admin" className="hover:underline">
              Админ хуудас
            </Link>
          )}
          {!authed ? (
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/' })}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
            >
              Нэвтрэх
            </button>
             ) : (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
            >
              Гарах
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}