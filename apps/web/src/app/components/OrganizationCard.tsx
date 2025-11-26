'use client';
import Image from 'next/image';

type Props = {
  id: string;
  name: string;
  rating: number;
  imageUrl?: string;
};

export default function OrganizationCard({ id, name, rating, imageUrl }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300 w-96"> 
      <div className="relative w-196 h-64 rounded-lg overflow-hidden mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center">
            Зураг алга
          </div>
         
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-yellow-400 font-bold">{'★'.repeat(Math.round(rating))}</p>
    </div>
  );
}

