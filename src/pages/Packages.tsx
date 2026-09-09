import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Map, ChevronRight } from 'lucide-react';
import { mockPackages } from '../data';
import { useState, useEffect } from 'react';
import { getStorage, setStorage } from '../lib/storage';
import { PackageCard } from '../components/PackageCard';


export default function Packages() {
  const [packages, setPackages] = useState<any[]>(mockPackages);

  useEffect(() => {
    const fetchPackages = async () => {
      let apiSuccess = false;
      try {
        const response = await fetch('/api/v1/vacations');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setPackages(data);
            setStorage('vacation_packages', data);
            apiSuccess = true;
          }
        }
      } catch (err) {
        console.warn("API not available for packages, falling back to local storage");
      }

      if (!apiSuccess) {
        let stored = getStorage('vacation_packages');
        // Force update if any package has less than 5 images
        if (stored && stored.length > 0) {
          const needsUpdate = stored.some((p: any) => p.images && p.images.length < 5);
          if (needsUpdate) {
            stored = mockPackages;
            setStorage('vacation_packages', mockPackages);
          }
        }
        
        if (!stored || stored.length === 0) {
          setStorage('vacation_packages', mockPackages);
          stored = mockPackages;
        }
        if (stored && stored.length > 0) {
          // Normalize the data format to match mockPackages structure
          const formatted = stored.map((d: any) => ({
            id: d.id || d._id,
            title: d.title,
            destination: d.destination,
            price: d.price,
            image: (d.images && d.images.length > 0) ? d.images[0] : d.image,
            images: d.images || [d.image],
            overview: d.overview,
            highlights: d.highlights || []
          }));
          setPackages(formatted);
        }
      }
    };
    fetchPackages();
  }, []);


  return (
    <div className="flex flex-col w-full bg-slate-50">
      {/* Header */}
      <section className="relative flex py-32 items-center justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
            alt="Travel Packages"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Vacation Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300"
          >
            Curated experiences for the modern traveler.
          </motion.p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-blue-950">Available Packages</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, idx) => (
              <PackageCard key={pkg.id} pkg={pkg} idx={idx} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
