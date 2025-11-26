/* eslint-disable @typescript-eslint/no-explicit-any */
// apps/web/src/app/yellow-books/[id]/page.tsx
// SSG page for /yellow-books/[id] — generateStaticParams + force static output
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const base = process.env.BOOKS_API_URL ?? 'http://localhost:5050';
  const res = await fetch(`${base}/businesses`);
  if (!res.ok) return [];
  const list = await res.json();
  return list.map((b: any) => ({ id: String(b.id) }));
}

export default async function BookPage({ params }: { params: { id: string } }) {
  const base = process.env.BOOKS_API_URL ?? 'http://localhost:5050';
  const res = await fetch(`${base}/businesses/${params.id}`);
  if (!res.ok) return <div className="p-6">Not found</div>;
  const item = await res.json();

  return (
    <article className="p-6">
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <p className="mt-4">{item.description}</p>
      <p className="mt-2 text-sm text-gray-400">Category: {item?.category?.name ?? '—'}</p>
    </article>
  );
}
