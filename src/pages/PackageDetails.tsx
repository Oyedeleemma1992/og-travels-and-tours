import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Check, PlaneTakeoff, Info, List, X, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mockPackages } from '../data';
import { getStorage, setStorage, generateId } from '../lib/storage';

export default function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<any>(null);
  useEffect(() => {
    const fetchPkg = async () => {
      let stored = getStorage('vacation_packages');
      if (!stored || stored.length === 0) {
        stored = mockPackages;
      }
      
      let data = stored.find((p: any) => p.id === id);
      
      // Force update if any package has less than 5 images
      if (stored && stored.length > 0) {
        const needsUpdate = stored.some((p) => p.images && p.images.length < 5);
        if (needsUpdate) {
          stored = mockPackages;
          setStorage('vacation_packages', mockPackages);
        }
      }
      
      data = stored.find((p) => p.id === id);

      if (data) {
        setPkg({
          ...data,
          image: (data.images && data.images.length > 0) ? data.images[0] : data.image,
          images: data.images || [data.image],
        });
      }
    };
    fetchPkg();
  }, [id]);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!pkg) return;
    const images = pkg.images || [pkg.image];
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [pkg]);

  const handleSubmit = async (e: import('react').FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.target as HTMLFormElement);
    const dataObj = Object.fromEntries(formData.entries());
    const currentContacts = getStorage("contact_messages");
    setStorage("contact_messages", [{ id: generateId(), date: new Date().toISOString(), ...dataObj }, ...currentContacts]);
    formData.append("access_key", "7f2e666d-2669-4779-90e3-775a813679fd");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('success');
      } else {
        console.error("Form submission failed", data);
        setFormStatus('idle');
        alert("Failed to send booking request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setFormStatus('idle');
      alert("An error occurred. Please try again later.");
    }
  };

  if (!pkg) return <div className="p-20 text-center">Loading...</div>;
  if (!pkg.title) {
    return <div className="py-24 text-center">Package not found.</div>;
  }
  
  const images = pkg.images || [pkg.image];

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <section className="relative flex py-40 items-end justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <AnimatePresence >
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={pkg.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
        
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center rounded-full bg-yellow-500/20 px-4 py-1.5 text-sm font-semibold text-yellow-400 backdrop-blur-md"
          >
            <Map className="mr-2 h-4 w-4" /> {pkg.destination}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {pkg.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center mt-2"
          >
            <div className="text-3xl font-bold text-yellow-500">
              {pkg?.price}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div className="relative h-96 w-full overflow-hidden rounded-3xl shadow-sm">
                <AnimatePresence>
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`${pkg.title} - Gallery Image`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-blue-950 mb-6 flex items-center">
                  <Info className="mr-3 h-8 w-8 text-yellow-500" /> Overview
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">{pkg.overview}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center">
                  <List className="mr-3 h-7 w-7 text-yellow-500" /> Highlights
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.isArray(pkg.highlights) && pkg.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="mt-1 mr-3 h-2 w-2 rounded-full bg-yellow-500 shrink-0" />
                      <span className="text-slate-700 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-blue-950 mb-4 flex items-center">
                    <Check className="mr-2 h-6 w-6 text-green-500" /> Inclusions
                  </h3>
                  <ul className="space-y-3">
                    {Array.isArray(pkg.inclusions) && pkg.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start text-slate-600">
                        <Check className="mr-2 h-5 w-5 text-green-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-blue-950 mb-4 flex items-center">
                    <X className="mr-2 h-6 w-6 text-red-500" /> Exclusions
                  </h3>
                  <ul className="space-y-3">
                    {Array.isArray(pkg.exclusions) && pkg.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start text-slate-600">
                        <X className="mr-2 h-5 w-5 text-red-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-32 bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <h3 className="text-2xl font-bold text-blue-950 mb-6">Book this Package</h3>
                
                {formStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <Check className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-950 mb-2">Thank you! Your booking request has been received successfully.</h4>
                    <p className="text-slate-600 mb-6">Our team will contact you shortly.</p>
                    <button onClick={() => setFormStatus('idle')} className="text-blue-950 font-semibold hover:underline">
                      Book another package
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="subject" value={`New Booking Request: ${pkg.title}`} />
                    <input type="hidden" name="package_name" value={pkg.title} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                        <input name="first_name" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input name="last_name" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input name="email" required type="email" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input name="phone" required type="tel" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Travel Dates (Approx.)</label>
                      <input name="travel_dates" required type="text" placeholder="e.g. Dec 10 - Dec 20" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Number of Travelers</label>
                      <input name="travelers" required type="number" min="1" defaultValue="1" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Special Requests / Message</label>
                      <textarea name="message" rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full rounded-xl bg-blue-950 px-6 py-4 font-bold text-white transition-colors hover:bg-blue-900 disabled:opacity-70 flex items-center justify-center"
                    >
                      {formStatus === 'submitting' ? 'Submitting...' : 'Request Quote'}
                    </button>
                    <a
                      href="https://wa.me/2348110207299"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-3 rounded-xl bg-green-500 px-6 py-4 font-bold text-white transition-colors hover:bg-green-600 flex items-center justify-center"
                    >
                      Book via WhatsApp
                    </a>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
