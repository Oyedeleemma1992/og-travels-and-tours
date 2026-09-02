import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Map } from 'lucide-react';

export function PackageCard({ pkg, idx }: { pkg: any, idx: number, key?: string | number }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = pkg.images || [pkg.image];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 4000 + Math.random() * 2000); // randomize slightly to prevent them all syncing
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200 border border-slate-100"
    >
      <div className="relative h-64 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-blue-950/20 z-10 transition-opacity group-hover:opacity-0" />
        <AnimatePresence>
          <motion.img
            key={currentIdx}
            src={images[currentIdx]}
            alt={pkg.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </AnimatePresence>
        <div className="absolute top-4 right-4 z-20 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 font-bold text-blue-950 shadow-sm">
          {pkg.price}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2 flex items-center text-sm font-semibold text-yellow-600">
          <Map className="mr-1.5 h-4 w-4" />
          {pkg.destination}
        </div>
        <h3 className="mb-3 text-2xl font-bold text-blue-950">{pkg.title}</h3>
        <p className="mb-6 text-slate-600 line-clamp-2 flex-grow">{pkg.overview}</p>
        
        <Link
          to={`/packages/${pkg.id}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-50 py-3 font-semibold text-blue-950 transition-colors hover:bg-blue-950 hover:text-white border border-slate-200 mt-auto"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
