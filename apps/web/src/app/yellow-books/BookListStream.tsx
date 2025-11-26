// apps/web/src/app/yellow-books/BookListStream.tsx
// Streamed async server component — ISR-updated (revalidate=60)
import React from 'react';

export default async function BookListStream() {
  const res = await fetch('http://localhost:5050/businesses', { next: { revalidate: 60 } });
  if (!res.ok) return <div className="mt-6 text-red-400">Failed to load</div>;
  const items: any[] = await res.json();

  return (
    <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((b) => (
        <article key={b.id} className="p-4 bg-white/5 rounded">
          <h3 className="font-semibold text-white">{b.name}</h3>
          <p className="text-sm text-gray-300">{b.description}</p>
        </article>
      ))}
    </section>
  );
}
