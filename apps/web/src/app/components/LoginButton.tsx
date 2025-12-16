'use client';
import { signIn } from 'next-auth/react';

export default function LoginButton() {
  return (
    <button
      className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
      onClick={() => signIn('github', { callbackUrl: '/login' })}
    >
      НЭВТРЭХ
    </button>
  );
}