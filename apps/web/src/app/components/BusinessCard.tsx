// ...existing code...
import { Globe, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { BusinessSchema } from '@yellow/contract';

type Business = z.infer<typeof BusinessSchema>;

export default function BusinessCard({ business }: { business: Business }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col gap-3">
      {business.logoUrl ? (
        <img
          src={business.logoUrl}
          alt={`${business.name} logo`}
          className="w-20 h-20 rounded-full object-cover self-start"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold self-start">
          {business.name?.split(' ').map(s => s[0]).slice(0,2).join('') || '—'}
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800">{business.name}</h2>
      <p className="text-gray-600 text-sm">{business.description}</p>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MapPin size={16} />
        <span>{business.address}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Phone size={16} />
        <span>{business.phone}</span>
      </div>

      <div className="mt-2 flex gap-3">
        {business.website && (
          <Link
            href={business.website}
            target="_blank"
            className="flex items-center gap-1 text-blue-500 hover:underline"
          >
            <Globe size={16} /> Вебсайт
          </Link>
        )}
      </div>
    </div>
  );
}
//