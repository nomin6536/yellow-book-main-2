'use client';
import {BusinessSchema } from '@yellow/contract';
import z from 'zod';


type Business = z.infer<typeof BusinessSchema>;

export default function OrganizationCard({ business }: { business: Business }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300 w-96"> 
      <div className="relative w-196 h-64 rounded-lg overflow-hidden mb-4">
        {business.logoUrl ?  (
          <img
            src={business.logoUrl}
            alt={`${business.name} logo`}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center">
            Зураг алга
          </div>
         
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
      <p className="text-yellow-400 font-bold">{'★'.repeat(Math.round(business.rating ?? 0))}</p>
    </div>
  );
}

