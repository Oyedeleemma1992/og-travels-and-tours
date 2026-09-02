import { useState } from 'react';
import type { FormEvent, ElementType } from 'react';
import { Plane, Building, Car, Calendar, MapPin, Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

type Tab = 'flights' | 'hotels' | 'cars';

export function KayakWidget({ onSearchResults }: { onSearchResults: (results: any, error?: string) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('flights');
  const [loading, setLoading] = useState(false);
  
  // Flights state
  const [flightType, setFlightType] = useState<'round' | 'one-way'>('round');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [cabin, setCabin] = useState('Economy');

  // Hotels state
  const [hotelCity, setHotelCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1 Guest, 1 Room');

  // Cars state
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [driverAge, setDriverAge] = useState('25+');

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Construct search params
    let searchParams: Record<string, any> = {};
    if (activeTab === 'flights') {
      searchParams = { origin, destination, departureDate, returnDate: flightType === 'round' ? returnDate : undefined, passengers, cabin, type: flightType };
    } else if (activeTab === 'hotels') {
      searchParams = { city: hotelCity, checkIn, checkOut, guests };
    } else if (activeTab === 'cars') {
      searchParams = { pickup, dropoff, pickupDate, dropoffDate, driverAge };
    }

    try {
      const trackId = sessionStorage.getItem('userTrackId') || crypto.randomUUID();
      sessionStorage.setItem('userTrackId', trackId);

      const res = await fetch('/api/kayak/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          searchParams,
          userTrackId: trackId
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Search failed');
      }

      const data = await res.json();
      onSearchResults(data);
    } catch (err: any) {
      console.error(err);
      onSearchResults(null, err.message || "Failed to connect to Sandbox API");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: ElementType }[] = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Building },
    { id: 'cars', label: 'Cars', icon: Car },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 shadow-2xl">
      <div className="absolute -top-3 -right-3 z-10 bg-yellow-500 text-blue-950 text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center">
        <AlertCircle className="w-3 h-3 mr-1" />
        Sandbox / Beta Mode
      </div>
      
      <div className="flex bg-slate-900/40 rounded-xl p-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all",
              activeTab === tab.id ? "bg-white text-blue-950 shadow-sm" : "text-white hover:bg-white/10"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-xl p-6 shadow-inner text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'flights' && (
              <div className="space-y-4">
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="radio" checked={flightType === 'round'} onChange={() => setFlightType('round')} className="mr-2 accent-blue-950" />
                    Round Trip
                  </label>
                  <label className="flex items-center text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="radio" checked={flightType === 'one-way'} onChange={() => setFlightType('one-way')} className="mr-2 accent-blue-950" />
                    One Way
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Origin</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="text" placeholder="City or Airport" value={origin} onChange={e => setOrigin(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="text" placeholder="City or Airport" value={destination} onChange={e => setDestination(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Departure</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                  {flightType === 'round' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Return</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input required type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Passengers</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select value={passengers} onChange={e => setPassengers(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800 bg-white">
                        {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Class</label>
                    <select value={cabin} onChange={e => setCabin(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800 bg-white">
                      <option value="Economy">Economy</option>
                      <option value="Premium Economy">Premium Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First Class</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hotels' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-1 lg:col-span-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="text" placeholder="City, Hotel, or Landmark" value={hotelCity} onChange={e => setHotelCity(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Check-in</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Check-out</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Guests & Rooms</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select value={guests} onChange={e => setGuests(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800 bg-white">
                      <option value="1 Guest, 1 Room">1 Guest, 1 Room</option>
                      <option value="2 Guests, 1 Room">2 Guests, 1 Room</option>
                      <option value="4 Guests, 2 Rooms">4 Guests, 2 Rooms</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cars' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Pick-up Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="text" placeholder="City or Airport" value={pickup} onChange={e => setPickup(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Drop-off Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="text" placeholder="Same as Pick-up (or enter new)" value={dropoff} onChange={e => setDropoff(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Pick-up Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Drop-off Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required type="date" value={dropoffDate} onChange={e => setDropoffDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Driver Age</label>
                    <select value={driverAge} onChange={e => setDriverAge(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800 bg-white">
                      <option value="18-24">18 - 24</option>
                      <option value="25+">25+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-950 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-900 focus:ring-4 focus:ring-blue-950/20 disabled:opacity-70 flex items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching Sandbox...
              </span>
            ) : (
              'Search KAYAK'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
