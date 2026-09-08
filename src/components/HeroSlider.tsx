import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlightItineraryWizard } from './FlightItineraryWizard';

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop',
    alt: 'Airplane flying over clouds',
  },
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop',
    alt: 'Luxury resort and pool',
  },
  {
    url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop',
    alt: 'Luxury vacation in Paris',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop',
    alt: 'Beautiful tropical beach',
  },
  {
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop',
    alt: 'Dubai city view',
  }
];

export function HeroSlider({ onSearchResults }: { onSearchResults?: (results: any, error?: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence >
          <motion.img
            key={currentIndex}
            src={HERO_IMAGES[currentIndex].url}
            alt={HERO_IMAGES[currentIndex].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-slate-900/60 z-10" />
      </div>

      {/* Fixed Text Overlay */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Explore the World <br className="hidden sm:block" />
          <span className="text-yellow-500">with Confidence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-10 max-w-3xl text-lg text-slate-300 sm:text-xl leading-relaxed"
        >
          We make international travel simple through flight bookings, visa assistance, vacation packages, study abroad support, airport pickup services, and corporate travel solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full"
        >
          <FlightItineraryWizard />
        </motion.div>
      </div>
    </section>
  );
}
