import { Suspense } from 'react';
import type { Business, Category } from '@yellow/contract';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import AllBusinessesMarquee from './components/AllBusinesses';
import CategoryCarousel from './components/Category';
import SearchSection from './components/SearchBar';
import TopRating from './components/TopRating';

// API-гаас SSR үеэр өгөгдөл авах
export const dynamic = 'force-dynamic';

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('http://localhost:5050/categories', { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  const data: Category[] = await res.json();
  return data.map((c, i) => ({ ...c, imageUrl: `/category${i + 1}.jpg` }));
}

async function fetchAllBusinesses(): Promise<Business[]> {
  const res = await fetch('http://localhost:5050/businesses', { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  const data: Business[] = await res.json();
  return data;
}

export default async function HomePage() {

  const session = await getServerSession(authOptions);

  let categories: Category[] = [];
  let allBusinesses: Business[] = [];
  try {
    [categories, allBusinesses] = await Promise.all([fetchCategories(), fetchAllBusinesses()]);
  } catch (err) {
    console.error('Failed to fetch data:', err);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#201235] via-[#2b1940] to-[#4b2f7a] text-white">
      <header className="max-w-6xl mx-auto flex items-center justify-between py-8 px-6">
        <div className="text-2xl font-semibold tracking-wider">ТАНИЛ</div>
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/80">
              {session.user?.name ?? session.user?.email}
            </span>
            {/* Админ бол badge харуулахыг хүсвэл: (session as any)?.role === 'admin' */}
            <LogoutButton />
          </div>
        ) : (
          <LoginButton />
        )}
      </header>

      <main className="px-6">
        <div className="max-w-4xl mx-auto text-center mt-8">
          <h1 className="text-[56px] font-extrabold leading-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
            Хаана Байна, Юу Байна
          </h1>
          <h2 className="text-[56px] font-extrabold text-[#c9a9ef] mt-0">БҮГД ЭНД!</h2>
        </div>

        <div className="mt-12 mb-24">
          <Suspense fallback={<div className="text-center text-white/50">Loading search...</div>}>
            <SearchSection categories={categories} allBusinesses={allBusinesses} />
          </Suspense>
        </div>

        <Suspense fallback={<div className="text-center text-white/50 mt-20">Loading categories...</div>}>
          <CategoryCarousel categories={categories} />
        </Suspense>

        <Suspense fallback={<div className="text-center text-white/50 mt-20">Loading top ratings...</div>}>
          <TopRating />
        </Suspense>

        <Suspense fallback={<div className="text-center text-white/50 mt-20">Loading businesses...</div>}>
          <AllBusinessesMarquee businesses={allBusinesses} />
        </Suspense>

        <footer className="w-full mt-16 bg-gradient-to-t from-[#2b1940] to-[#201235] py-8 text-white/80 text-center">
          &copy; {new Date().getFullYear()} ТАНИЛ. Бүх эрх хамгаалагдсан.
        </footer>
      </main>
    </div>
  );
}
