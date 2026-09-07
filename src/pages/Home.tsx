import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, ShieldCheck, CreditCard, Clock, Map, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { mockPackages, mockTestimonials, mockFAQs } from '../data';
import { getStorage, setStorage, generateId } from '../lib/storage';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { PackageCard } from '../components/PackageCard';

import { HeroSlider } from '../components/HeroSlider';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<string | null>('f1');
  const [packages, setPackages] = useState(mockPackages);
  const [reviews, setReviews] = useState(mockTestimonials);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5 });
  
  // Search state
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGeneratePdf = async (result: any) => {
    try {
      setDownloadingPdf(result.id);
      const res = await fetch('https://ogtravelsandtours.com/api/generate-pdf', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      
      if (!res.ok) throw new Error('Failed to generate PDF');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Itinerary-${result.id || 'download'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF');
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleSearchResults = (results: any, error?: string) => {
    setSearchResults(results);
    setSearchError(error || null);
    
    // Scroll to results smoothly
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReviewSubmit = (e: import('react').FormEvent) => {
    e.preventDefault();
    const reviewData = { id: generateId(), ...newReview };
    const updatedReviews = [reviewData, ...reviews];
    setReviews(updatedReviews);
    setStorage("reviews", updatedReviews);
    setIsReviewFormOpen(false);
    setNewReview({ name: "", text: "", rating: 5 });
  };

  useEffect(() => {
    const storedReviews = getStorage('reviews');
    if (storedReviews && storedReviews.length > 0) {
      setReviews(storedReviews);
    }
    const storedPackages = getStorage('vacation_packages');
    if (storedPackages && storedPackages.length > 0) {
      // Force update if any package has less than 5 images
      const needsUpdate = storedPackages.some((p: any) => p.images && p.images.length < 5);
      if (needsUpdate) {
        setPackages(mockPackages);
        setStorage('vacation_packages', mockPackages);
      } else {
        setPackages(storedPackages);
      }
    } else {
      setStorage('vacation_packages', mockPackages);
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroSlider onSearchResults={handleSearchResults} />

      {/* Search Results Section */}
      <div ref={resultsRef}>
        {(searchResults || searchError) && (
          <section className="bg-slate-50 py-16 border-b border-slate-200">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center">
                Search Results
              </h2>
              
              {searchError ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h3 className="text-red-800 font-semibold mb-2">Error connecting to Sandbox</h3>
                  <p className="text-red-700">{searchError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults?.message && (
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4 text-sm font-medium">
                      {searchResults.message}
                    </div>
                  )}
                  {searchResults?.results?.length > 0 ? (
                    <div className="grid gap-4">
                      {searchResults.results.map((result: any) => (
                        <div key={result.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md">
                          <div>
                            <div className="text-sm text-slate-500 font-medium mb-1">{result.provider}</div>
                            <h3 className="text-xl font-bold text-blue-950">{result.title}</h3>
                            <p className="text-slate-600 mt-1">{result.details}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-slate-900">{result.price}</div>
                            <button 
                              onClick={() => handleGeneratePdf(result)}
                              disabled={downloadingPdf === result.id}
                              className="mt-2 bg-yellow-500 text-blue-950 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                              {downloadingPdf === result.id ? 'Generating...' : 'Download PDF'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-100">
                      <p className="text-slate-500 text-lg">No results found for your search criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-950 sm:text-4xl">Why Choose OG Travels</h2>
            <p className="mt-4 text-lg text-slate-600">Your trusted travel partner for seamless international experiences.</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Trusted Experts', desc: 'Years of experience in the travel industry ensuring reliable service.' },
              { icon: CreditCard, title: 'Affordable Packages', desc: 'Competitive pricing and flexible payment options for all budgets.' },
              { icon: Clock, title: 'Fast Response', desc: '24/7 dedicated customer support to assist you anytime, anywhere.' },
              { icon: Map, title: 'Visa Assistance', desc: 'Expert guidance through complex visa application processes.' },
              { icon: Star, title: 'Personalized Support', desc: 'Tailored itineraries designed specifically for your preferences.' },
              { icon: CheckCircle2, title: 'Secure Booking', desc: 'Safe and encrypted transactions for your peace of mind.' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-950 transition-colors group-hover:bg-blue-950 group-hover:text-yellow-500">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-blue-950">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-blue-950 sm:text-4xl">Featured Vacation Packages</h2>
              <p className="mt-4 text-lg text-slate-600">Discover our handpicked destinations for your next unforgettable journey.</p>
            </div>
            <Link to="/packages" className="hidden md:inline-flex items-center text-blue-950 font-semibold hover:text-yellow-600 transition-colors">
              View All Packages <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, idx) => (
              <PackageCard key={pkg.id} pkg={pkg} idx={idx} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Link to="/packages" className="inline-flex items-center justify-center rounded-full bg-blue-950 px-8 py-3 text-sm font-semibold text-white">
                View All Packages
             </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Our Comprehensive Services</h2>
            <p className="mt-4 text-lg text-slate-400">Everything you need for a smooth and memorable trip.</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Flight Booking', desc: 'Domestic & international flights at the best rates.', path: '/services/flights', icon: Plane },
              { title: 'Visa Assistance', desc: 'Expert guidance for tourist, student, and business visas.', path: '/services/visa', icon: Map },
              { title: 'Hotel Reservations', desc: 'From budget stays to luxury 5-star resorts globally.', path: '/services/hotels', icon: Star },
              { title: 'Admission Assistance', desc: 'University admissions and visa processing support.', path: '/services/admission', icon: ShieldCheck },
            ].map((srv, idx) => (
              <Link key={idx} to={srv.path} className="group block h-full">
                <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-800/50 p-8 transition-all hover:bg-slate-800 hover:border-slate-700">
                  <srv.icon className="mb-6 h-10 w-10 text-yellow-500" />
                  <h3 className="mb-3 text-xl font-bold">{srv.title}</h3>
                  <p className="mb-6 flex-1 text-slate-400">{srv.desc}</p>
                  <div className="flex items-center font-semibold text-yellow-500 group-hover:text-yellow-400">
                    Learn More <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-950 sm:text-4xl">What Our Clients Say</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {reviews.map((test: any) => (
              <div key={test.id} className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-6 flex space-x-1 text-yellow-500">
                  {[...Array(test.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="mb-6 text-lg text-slate-700 italic">"{test.text}"</p>
                <div className="font-bold text-blue-950">{test.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            {!isReviewFormOpen ? (
              <button 
                onClick={() => setIsReviewFormOpen(true)}
                className="rounded-full bg-blue-950 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-900"
              >
                Leave a Review
              </button>
            ) : (
              <div className="mx-auto max-w-2xl bg-white p-8 rounded-3xl shadow-sm text-left">
                <h3 className="text-2xl font-bold text-blue-950 mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                    <input required type="text" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
                    <input required type="number" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Review</label>
                    <textarea required rows={4} value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none"></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white hover:bg-blue-900">Submit Review</button>
                    <button type="button" onClick={() => setIsReviewFormOpen(false)} className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-300">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-950 sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {mockFAQs.map((faq) => (
              <div key={faq.id} className="rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  className="flex w-full items-center justify-between bg-slate-50 p-6 text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <span className="font-bold text-blue-950">{faq.question}</span>
                  <ChevronRight className={cn("h-5 w-5 text-slate-400 transition-transform", openFaq === faq.id && "rotate-90")} />
                </button>
                {openFaq === faq.id && (
                  <div className="bg-white p-6 pt-2 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-blue-950 py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-950/90 mix-blend-multiply" />
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop" alt="Travel" className="h-full w-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-5xl">Ready to Start Your Journey?</h2>
          <p className="mb-10 text-xl text-slate-300">Contact our travel experts today for a free consultation and personalized quote.</p>
          <Link
            to="/contact"
            className="inline-flex rounded-full bg-yellow-500 px-10 py-4 text-lg font-bold text-blue-950 transition-colors hover:bg-yellow-400"
          >
            Request a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
