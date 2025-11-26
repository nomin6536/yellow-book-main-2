'use client';
import React, { useState, useEffect } from 'react';

type Business = {
  id: string; 
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
};

import { useParams } from 'next/navigation';
  export default function CategoryList() {
 const params = useParams() as { id?: string };  const categoryId = params?.id ?? '';
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5050/businesses/category?categoryId=${categoryId}`);
        if (!res.ok) throw new Error('Failed to fetch businesses');
        const data: Business[] = await res.json();
        setBusinesses(data);
      } catch (err) {
        console.error('Error loading businesses:', err);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) fetchBusinesses();
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-[#201235] text-white py-12 px-6">
      <h1 className="text-4xl font-bold mb-6">Жагсаалт</h1>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : businesses.length === 0 ? (
        <p>Бизнес олдсонгүй</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((b) => (
            <div
              key={b.id}
              className="bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition"
              onClick={() => setSelectedBusiness(b)}
            >
              <h3 className="font-semibold text-lg mb-1">{b.name}</h3>
              <p className="text-sm text-gray-300">{b.description}</p>
            </div>
          ))}
        </div>
      )}

      {selectedBusiness && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2b1940] p-8 rounded-xl max-w-lg w-full relative">
            <button
              onClick={() => setSelectedBusiness(null)}
              className="absolute top-3 right-3 text-white text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-3xl font-bold mb-4">{selectedBusiness.name}</h2>
            {selectedBusiness.description && <p className="mb-2">{selectedBusiness.description}</p>}
            {selectedBusiness.address && <p className="mb-2">📍 {selectedBusiness.address}</p>}
            {selectedBusiness.phone && <p className="mb-2">📞 {selectedBusiness.phone}</p>}
            {selectedBusiness.website && (
              <a
                href={selectedBusiness.website}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline"
              >
                Вэбсайт
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
