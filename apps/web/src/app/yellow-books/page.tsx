// apps/web/src/app/yellow-books/page.tsx
// ISR page for /yellow-books — revalidate=60, streams featured list inside Suspense
import React, { Suspense } from 'react';
import BookListStream from './BookListStream';

export const revalidate = 60;

export default function YellowBooksPage() {
  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold">Yellow Books (ISR — revalidate 60s)</h1>

      <Suspense fallback={<div className="mt-6 text-gray-300">Loading featured books…</div>}>
        <BookListStream />
      </Suspense>
    </div>
  );
}
