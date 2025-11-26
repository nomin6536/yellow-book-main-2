/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import OrganizationCard from '../components/OrganizationCard';
import MapIsland from './MapIsland.client';
import type { Business } from '@yellow/contract';

interface Props {
  initialBusinesses: Business[];
  initialQuery?: string;
  selectedBusiness?: Business;
}
export default function SearchPageClient({ initialBusinesses, initialQuery = '', selectedBusiness }: Props) {  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const cats: never[] = []; // server passed categories not available here — keep empty
    const bizMatches = initialBusinesses
      .filter((b) => b.name.toLowerCase().includes(term))
      .slice(0, 8)
      .map((b) => ({ id: b.id, name: b.name, type: 'business' as const }));
    return [...cats, ...bizMatches].slice(0, 10);
  }, [query, initialBusinesses]);

  const handleSearch = (q: string) => {
    setQuery(q);
    const term = q.trim().toLowerCase();
    if (!term) {
      setBusinesses(initialBusinesses);
      router.push('/search');
      return;
    }
    setBusinesses(
      initialBusinesses.filter((b) =>
        [b.name, b.description ?? '', b.location ?? ''].some((s) => s.toLowerCase().includes(term))
      )
    );
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSelect = (s: { id: string | number; name: string; type: 'category' | 'business' }) => {
    if (s.type === 'category') router.push(`/businesses/category?categoryId=${s.id}`);
    else router.push(`/search?q=${encodeURIComponent(String(s.name))}`);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <SearchBar {...({ onSearch: handleSearch, onSelect: handleSelect, suggestions } as any)} />
        <div className="mt-6 space-y-4">
          {businesses.map((b) => (
            <OrganizationCard
              key={b.id}
              id={b.id}
              name={b.name}
              rating={b.rating ?? 0}
              imageUrl={(b as any).imageUrl ?? undefined}
            />
          ))}
          {businesses.length === 0 && <p className="text-white/60 mt-6">Хайлтанд тохирох бизнес олдсонгүй.</p>}
        </div>
      </div>

      <div className="h-[600px] rounded-lg overflow-hidden">
       <MapIsland businesses={businesses} selectedBusiness={selectedBusiness} />
      </div>
    </div>
  );
}