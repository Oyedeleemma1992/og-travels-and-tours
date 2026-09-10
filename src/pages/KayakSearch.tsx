import { useState, useEffect } from 'react';
import { Plane, Building, Car, Search, MapPin, Calendar, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { generateId } from '../lib/storage'; // UUID generation from storage (can double as userTrackId)

// Generate session UUID if missing
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('kayak_session_id');
  if (!sessionId) {
    // Generate UUID v4 format
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    sessionStorage.setItem('kayak_session_id', sessionId);
  }
  return sessionId;
};

export default function KayakSearch() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'cars'>('flights');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = async (e: import('react').FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    const userTrackId = getSessionId();

    try {
      const response = await fetch('/api/kayak/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: activeTab,
          userTrackId,
          searchParams: {
            origin,
            destination,
            date
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-950 sm:text-5xl mb-4">
            Global Search
          </h1>
          <p className="text-lg text-slate-600">
            Find the best flights, hotels, and cars in real-time, powered by KAYAK.
          </p>
        </div>

        {/* Search Widget */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setActiveTab('flights')}
              className={cn(
                "flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors",
                activeTab === 'flights' ? "bg-blue-950 text-white" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Plane className="h-5 w-5" /> Flights
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={cn(
                "flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors",
                activeTab === 'hotels' ? "bg-blue-950 text-white" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Building className="h-5 w-5" /> Hotels
            </button>
            <button
              onClick={() => setActiveTab('cars')}
              className={cn(
                "flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors",
                activeTab === 'cars' ? "bg-blue-950 text-white" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Car className="h-5 w-5" /> Cars
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(activeTab === 'flights' || activeTab === 'cars') && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-950">
                    {activeTab === 'cars' ? 'Pick-up Location' : 'Origin'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder={activeTab === 'cars' ? 'Airport or City' : 'e.g., Boston (BOS)'}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-950">
                  {activeTab === 'hotels' ? 'Destination' : 'Destination'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={activeTab === 'hotels' ? 'City or Hotel Name' : 'e.g., London (LHR)'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-950">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-600 px-8 py-4 font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Searching...</>
                ) : (
                  <><Search className="h-5 w-5" /> Search {activeTab}</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-2xl bg-red-50 text-red-700 mb-8 border border-red-100"
            >
              <strong>Error:</strong> {error}
            </motion.div>
          )}

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-950">
                  Search Results
                </h2>
                {results.status === 'mocked' && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wider">
                    Sandbox Mode
                  </span>
                )}
              </div>

              {Array.isArray(results.results) && results.results.map((item: any, i: number) => (
                <div key={item.id || i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      {results.type === 'flights' ? <Plane className="h-6 w-6 text-blue-600" /> :
                       results.type === 'hotels' ? <Building className="h-6 w-6 text-blue-600" /> :
                       <Car className="h-6 w-6 text-blue-600" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-950">{item.title}</h3>
                      <p className="text-slate-500 mt-1">{item.details}</p>
                      <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">
                        Provider: {item.provider}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-950">{item.price}</div>
                    <button className="mt-3 px-6 py-2 bg-blue-950 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors w-full md:w-auto">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
