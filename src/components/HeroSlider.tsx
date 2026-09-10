import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';

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
    <section className="relative flex flex-col items-center justify-start overflow-hidden bg-slate-900 pb-16 pt-20 sm:pt-28">
      {/* Background Images */}
      <div className="absolute inset-0 z-0 min-h-[90vh]">
        <AnimatePresence>
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
          className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Explore the World <br className="hidden sm:block" />
          <span className="text-yellow-500">with Confidence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-10 max-w-3xl text-base text-slate-300 sm:text-xl leading-relaxed"
        >
          We make international travel simple through flight bookings, visa assistance, vacation packages, study abroad support, airport pickup services, and corporate travel solutions.
        </motion.p>
      </div>

      {/* Live Flight Search Widget */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-20 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          <iframe
            src="/tpwl-widget.html"
            title="Flight Search Widget"
            className="w-full border-0"
            style={{ minHeight: '650px' }}
          />
        </div>
      </motion.div>

      {/* Visa Reservation Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 mt-8"
      >
        <Link
          to="/flight-booking?tab=visa"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
        >
          <CalendarCheck className="h-5 w-5" />
          Visa Reservations
        </Link>
      </motion.div>
    </section>
  );
}