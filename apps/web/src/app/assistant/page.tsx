'use client';
import React, { useState } from 'react';
import type { Business } from '@yellow/contract';

export default function YellowBooksAssistant() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<(Business & { _score?: number })[]>([]);

  const search = async () => {
    const term = q.trim();
    if (!term) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5050/api/ai/yellow-books/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q: term }),
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#201235] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Yellow Books Assistant</h1>
      <div className="flex gap-3 max-w-2xl">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Юу хайх вэ?"
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button onClick={search} className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">
          Хайх
        </button>
      </div>

      {loading && <p className="mt-6 text-white/60">Хайж байна...</p>}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((b) => (
          <div key={b.id} className="bg-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{b.name}</h3>
              {typeof b._score === 'number' && (
                <span className="text-xs text-white/70">score: {b._score.toFixed(3)}</span>
              )}
            </div>
            <p className="text-sm text-white/80 mt-2">{b.description}</p>
            <p className="text-sm text-white/60 mt-1">{b.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}