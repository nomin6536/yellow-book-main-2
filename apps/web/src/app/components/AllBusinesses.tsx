'use client';
import { motion } from 'framer-motion';
import { Business } from '@yellow/contract';

interface AllBusinessesMarqueeProps {
  businesses: Business[];
}

export default function AllBusinessesMarquee({ businesses }: AllBusinessesMarqueeProps) {
  const marqueeVariants = {
    animate: {
      x: ['0%', '-100%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 20,
          ease: 'linear',
        },
      },
    },
  };

  return (
    <section className="max-w-full overflow-hidden py-16 bg-[#2b1940] mt-28">
      <h2 className="text-3xl font-bold text-center mb-8">Бүх Business</h2>
      <div className="relative w-full">
        <motion.div
          className="flex space-x-6"
          variants={marqueeVariants}
          animate="animate"
        >
          {[...businesses, ...businesses].map((b, i) => (
            <div
              key={`${b.id}-${i}`}
              className="min-w-[280px] rounded-2xl bg-white/10 p-4 text-center flex flex-col items-center justify-center"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{b.name}</h3>
              <p className="text-white/80">Rating: {b.rating} ⭐</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
