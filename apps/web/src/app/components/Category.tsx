'use client';
import { motion } from 'framer-motion';
import { Category } from '@yellow/contract';
import { useRouter } from 'next/navigation';

export default function CategoryCarousel({ categories }: { categories: (Category & { imageUrl?: string })[] }) {
  const router = useRouter();

  return (
    <div className="relative flex justify-center items-center px-6 py-14" style={{ perspective: '800px', height: 260 }}>
      {categories.slice(0, 5).map((cat, i) => {
        const total = 5;
        const radius = 750;
        const centerIndex = Math.floor(total / 2);
        const angleStep = 30;
        const angle = (i - centerIndex) * angleStep;
        const rad = (angle * Math.PI) / 180;
        const translateX = Math.sin(rad) * radius;
        const translateZ = Math.cos(rad) * radius * 0.8;
        const rotateY = -angle * 0.9;
        const scale = 1.45 - Math.abs(i - centerIndex) * 0.05;
        const zIndex = Math.round(1000 - translateZ);
        const depthFactor = translateZ / (radius * 0.8);
        const opacity = 1 - depthFactor * 0.12;
        const boxShadow = `0 ${10 - depthFactor * 6}px ${30 - depthFactor * 10}px rgba(0,0,0,${Math.max(0.08, 0.28 - depthFactor * 0.12)})`;

        return (
          <motion.div
            key={cat.id}
            className="absolute w-52 h-72 rounded-2xl overflow-hidden bg-white/10 border border-white/10 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateX(${translateX}px) translateZ(-${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
              zIndex,
              opacity,
              boxShadow,
            }}
            onClick={() => router.push(`/list/${cat.id}`)}
          >
            <img src={cat.imageUrl ?? '/images/default-category.jpg'} alt={cat.name} className="w-full h-60 object-cover" />
            <div className="bg-white/10 text-center py-3 text-lg font-semibold text-white backdrop-blur-sm">
              {cat.name}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
