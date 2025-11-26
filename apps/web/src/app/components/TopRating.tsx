import OrganizationCard from './OrganizationCard';
import { Business } from '@yellow/contract';

async function fetchTopBusinesses(): Promise<Business[]> {
  const res = await fetch('http://localhost:5050/businesses', {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch top businesses');

  const data: Business[] = await res.json();
  return data
    .filter((b) => b.topRating)
    .map((b, i) => ({
      ...b,
      imageUrl: `/images/default${(i % 5) + 1}.jpg`,
    }));
}

export default async function TopRating() {
  const topBusinesses = await fetchTopBusinesses();

  if (topBusinesses.length === 0)
    return <p className="text-white text-center mt-8">Онцлох бизнес алга</p>;

  return (
    <div className="max-w-6xl mx-auto mt-28 flex flex-col items-center gap-16">
      {topBusinesses.map((b, i) => (
        <div
          key={b.id}
          className={`${i % 2 === 0 ? 'self-end' : 'self-start'}`}
        >
          <OrganizationCard
            id={b.id}
            name={b.name}
            rating={b.rating}
          />
        </div>
      ))}
    </div>
  );
}
