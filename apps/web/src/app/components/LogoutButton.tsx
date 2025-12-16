'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      className="px-3 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
      onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
    >
      Гарах
    </button>
  );
}