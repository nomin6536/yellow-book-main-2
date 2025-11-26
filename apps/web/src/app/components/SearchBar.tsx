'use client';
import { useState } from 'react';
import type { Business, Category } from '@yellow/contract';
import { useRouter } from 'next/navigation';

type Suggestion = {
  id: string | number;
  name: string;
  type: 'category' | 'business';
};

interface SearchBarProps {
  onSearch: (q: string) => void;
  onSelect: (s: Suggestion) => void;
  onSubmit?: (q: string) => void;
  suggestions: Suggestion[];
}

function SearchBar({ onSearch, onSelect, onSubmit, suggestions }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleChange = (v: string) => {
    setValue(v);
    onSearch(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = value.trim();
      if (!q) return;
      onSubmit?.(q);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        aria-label="search"
        placeholder="Хайх..."
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      />
      {suggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-white/10 backdrop-blur-md rounded-xl shadow-lg z-10 max-h-60 overflow-auto">
          {suggestions.map((s) => (
            <div
              key={String(s.id)}
              onClick={() => {
                onSelect(s);
              }}
              className="px-4 py-3 cursor-pointer hover:bg-white/20 transition flex justify-between items-center"
            >
              <span>{s.name}</span>
             
              <span className="text-sm text-white/70 capitalize">{s.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SearchSectionProps {
  categories: Category[];
  allBusinesses: Business[];
}

export default function SearchSection({ categories, allBusinesses }: SearchSectionProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const router = useRouter();

  const handleSearch = (q: string) => {
    const term = q.trim().toLowerCase();
    if (!term) return setSuggestions([]);

    const catMatches: Suggestion[] = categories
      .filter((c) => c.name.toLowerCase().includes(term))
      .slice(0, 6)
      .map((c) => ({ id: c.id, name: c.name, type: 'category' as const }));

    const bizMatches: Suggestion[] = allBusinesses
      .filter((b) => b.name.toLowerCase().includes(term))
      .slice(0, 8)
      .map((b) => ({ id: b.id, name: b.name, type: 'business' as const }));

    setSuggestions([...catMatches, ...bizMatches].slice(0, 10));
  };

  const handleSelect = (s: Suggestion) => {
    setSuggestions([]);
    if (s.type === 'category')
      router.push(`/businesses/category?categoryId=${s.id}`);
    else router.push(`/search?q=${encodeURIComponent(String(s.name))}`);
  };

  const handleSubmit = (q: string) => {
    setSuggestions([]);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return <SearchBar onSearch={handleSearch} onSelect={handleSelect} onSubmit={handleSubmit} suggestions={suggestions} />;
}