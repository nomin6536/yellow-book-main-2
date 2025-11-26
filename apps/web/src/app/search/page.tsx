export const dynamic = 'force-dynamic';

import SearchPageClient from './SearchPageClient.client';
import { Business } from '../../../../../libs/contract/src/index';

type Props = { searchParams?: { q?: string; id?: string } };

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams?.q ?? 'yjina').trim();
  const id = searchParams?.id;

  // 1) Хэрвээ id ирсэн байвал зөвхөн тэр бизнесийг авчир
  if (id) {
    const res = await fetch(`http://localhost:5050/businesses/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch business');
    const biz: Business = await res.json();

    // lat/lng авах:
    const lat = (biz as any).latitude;
    const lng = (biz as any).longitude;
    console.log('Selected business coords:', lat, lng);

    // Client руу тухайн бизнесийг дамжуулах — map center хийхэд ашиглана
    return <SearchPageClient initialQuery={q} initialBusinesses={[biz]} selectedBusiness={biz} />;
  }

  // 2) Өөрөөр бол бүх business-үүдийг авч, q-ээр сервер талдаа шүү
  const res = await fetch('http://localhost:5050/businesses', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch businesses');
  const all: Business[] = await res.json();
  const qLower = q.toLowerCase();

  const businesses = q
    ? all.filter((b) =>
        [b.name, b.description ?? '', b.location ?? ''].some((s) =>
          s.toLowerCase().includes(qLower)
        )
      )
    : all;

  return <SearchPageClient initialQuery={q} initialBusinesses={businesses}  />;
}