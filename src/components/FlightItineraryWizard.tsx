import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CityAutocomplete } from './CityAutocomplete';
import { Plane, Users, Calendar, ChevronRight, CheckCircle2, FileText, CreditCard, Loader2, Hotel, Car } from 'lucide-react';
import { FlightResultsStep } from './wizard/FlightResultsStep';
import { HotelResultsStep } from './wizard/HotelResultsStep';
import { TransferResultsStep } from './wizard/TransferResultsStep';
import { PassengerFormStep } from './wizard/PassengerFormStep';
import { SeatSelectionStep } from './wizard/SeatSelectionStep';
import { ReviewPayStep } from './wizard/ReviewPayStep';
import { SuccessStep } from './wizard/SuccessStep';

export function FlightItineraryWizard() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'transfers'>('flights');
  
  const [isSearching, setIsSearching] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const [flightOffers, setFlightOffers] = useState<any[]>([]);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [hotelOffers, setHotelOffers] = useState<any[]>([]);
  const [transferOffers, setTransferOffers] = useState<any[]>([]);
  
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  
  const [passengerDetails, setPassengerDetails] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: ''
  });

  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    tripType: 'round',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'Economy'
  });

  const [hotelSearchParams, setHotelSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

  const [transferSearchParams, setTransferSearchParams] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: 1
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('reference');
    const trxref = urlParams.get('trxref');
    
    if (ref || trxref) {
      setPaymentRef(ref || trxref);
      setStep(6);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSearch = async () => {
    setSearchError(null);
    setIsSearching(true);
    
    try {
      if (activeTab === 'flights') {
        if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
          throw new Error('Please fill in all required fields (Origin, Destination, Departure Date).');
        }
        
        const payload = {
          searchParams: {
            origin: searchParams.origin,
            destination: searchParams.destination,
            departure_date: searchParams.departureDate,
            return_date: searchParams.tripType === 'round' ? searchParams.returnDate : undefined,
            cabin_class: searchParams.cabinClass,
            passengers: {
              adults: searchParams.adults,
              children: searchParams.children,
              infants: searchParams.infants
            }
          }
        };

        const res = await fetch('/api/v1/flights/search', {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to fetch flights. Please try again.');
        const resJson = await res.json();
        const extractedData = resJson.data || resJson;
        const finalOffers = extractedData.offers || extractedData.flights || (Array.isArray(extractedData) ? extractedData : []);
        setFlightOffers(Array.isArray(finalOffers) ? finalOffers : []);
        if (extractedData.searchId || extractedData.search_id || resJson.searchId || resJson.search_id) {
          setSearchId(extractedData.searchId || extractedData.search_id || resJson.searchId || resJson.search_id);
        }
        
      } else if (activeTab === 'hotels') {
        if (!hotelSearchParams.destination || !hotelSearchParams.checkIn || !hotelSearchParams.checkOut) {
          throw new Error('Please fill in Destination, Check-in, and Check-out dates.');
        }
        // Mock hotel search
        await new Promise(r => setTimeout(r, 1500));
        setHotelOffers([
          { id: 'h1', name: 'Grand Plaza Hotel', price: 150000, currency: 'NGN', rating: 5, location: 'City Center' },
          { id: 'h2', name: 'Boutique Suites', price: 85000, currency: 'NGN', rating: 4, location: 'Downtown' },
          { id: 'h3', name: 'Airport Transit Inn', price: 45000, currency: 'NGN', rating: 3, location: 'Airport Road' }
        ]);
        
      } else if (activeTab === 'transfers') {
        if (!transferSearchParams.pickup || !transferSearchParams.dropoff || !transferSearchParams.date) {
          throw new Error('Please fill in Pickup, Drop-off, and Date.');
        }
        // Mock transfer search
        await new Promise(r => setTimeout(r, 1200));
        setTransferOffers([
          { id: 't1', vehicleType: 'Standard Sedan', price: 25000, currency: 'NGN', capacity: 3, duration: '45 mins' },
          { id: 't2', vehicleType: 'Premium SUV', price: 45000, currency: 'NGN', capacity: 4, duration: '40 mins' },
          { id: 't3', vehicleType: 'Executive Van', price: 75000, currency: 'NGN', capacity: 8, duration: '50 mins' }
        ]);
      }
      
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || 'An error occurred during search.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFlight = async (flight: any) => {
    setSelectedFlight(flight);
    setIsRevalidating(true);
    setSearchError(null);
    
    try {
      const res = await fetch('/api/v1/flights/price_flight', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          searchId: searchId,
          offer_id: flight.id || flight.offerId || flight.offer_id,
          flightId: flight.id || flight.offerId || flight.offer_id,
          flightData: flight 
        })
      });
      
      if (!res.ok) throw new Error('Fare no longer available.');
      setStep(3);
    } catch (err) {
      console.error(err);
      setSearchError('The selected fare is no longer available. Please select another flight.');
    } finally {
      setIsRevalidating(false);
    }
  };

  const handleSelectHotel = (hotel: any) => {
    setSelectedHotel(hotel);
    setStep(3);
  };

  const handleSelectTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setStep(3);
  };

  const getActiveItem = () => {
    if (activeTab === 'flights') return selectedFlight;
    if (activeTab === 'hotels') return selectedHotel;
    return selectedTransfer;
  };

  const handleTabChange = (tab: 'flights' | 'hotels' | 'transfers') => {
    setActiveTab(tab);
    setStep(1);
    setSearchError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="text-center text-white mb-6">
        <h2 className="text-2xl font-bold">Book Your Flights & Travel Services</h2>
        <p className="text-slate-300 text-sm">Search live global flights, book securely, or generate professional travel itineraries.</p>
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-8 relative px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-700/50 -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-yellow-500 -z-10 rounded-full transition-all duration-500" 
          style={{ width: `${((Math.min(step, 5) - 1) / 4) * 100}%` }}
        />
        
        {[
          { num: 1, label: 'Search' },
          { num: 2, label: 'Select' },
          { num: 3, label: 'Guest' },
          { num: 4, label: 'Extras' },
          { num: 5, label: 'Checkout' }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center z-10 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.num ? 'bg-yellow-500 text-blue-950' : 'bg-slate-800 text-slate-400'}`}>
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
            </div>
            <span className="text-xs text-slate-300 mt-2 font-medium hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Service Tabs */}
            <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-700 mb-6">
              <button 
                onClick={() => handleTabChange('flights')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center font-semibold text-sm transition-colors ${activeTab === 'flights' ? 'bg-yellow-500 text-blue-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                <Plane className="w-4 h-4 mr-2" /> Flights
              </button>
              <button 
                onClick={() => handleTabChange('hotels')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center font-semibold text-sm transition-colors ${activeTab === 'hotels' ? 'bg-yellow-500 text-blue-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                <Hotel className="w-4 h-4 mr-2" /> Hotels
              </button>
              <button 
                onClick={() => handleTabChange('transfers')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center font-semibold text-sm transition-colors ${activeTab === 'transfers' ? 'bg-yellow-500 text-blue-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                <Car className="w-4 h-4 mr-2" /> Transfers
              </button>
            </div>

            {searchError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm font-medium">
                {searchError}
              </div>
            )}
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-4">
               {activeTab === 'flights' && (
                 <>
                   <div className="flex space-x-4 mb-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" checked={searchParams.tripType === 'round'} onChange={() => setSearchParams({...searchParams, tripType: 'round'})} className="text-yellow-500 focus:ring-yellow-500" />
                        <span className="text-white text-sm">Round Trip</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" checked={searchParams.tripType === 'one'} onChange={() => setSearchParams({...searchParams, tripType: 'one'})} className="text-yellow-500 focus:ring-yellow-500" />
                        <span className="text-white text-sm">One-Way</span>
                      </label>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <CityAutocomplete 
                       label="Origin" 
                       value={searchParams.origin} 
                       onChange={(v) => setSearchParams({...searchParams, origin: v})} 
                       required 
                       className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500"
                       labelClassName="text-xs font-semibold text-slate-300 uppercase"
                     />
                     <CityAutocomplete 
                       label="Destination" 
                       value={searchParams.destination} 
                       onChange={(v) => setSearchParams({...searchParams, destination: v})} 
                       required 
                       className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500"
                       labelClassName="text-xs font-semibold text-slate-300 uppercase"
                     />
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Departure</label>
                        <input type="date" value={searchParams.departureDate} onChange={e => setSearchParams({...searchParams, departureDate: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                      {searchParams.tripType === 'round' && (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Return</label>
                          <input type="date" value={searchParams.returnDate} onChange={e => setSearchParams({...searchParams, returnDate: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Adults</label>
                        <input type="number" min="1" value={searchParams.adults} onChange={e => setSearchParams({...searchParams, adults: parseInt(e.target.value)})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                      <div className="space-y-1 flex gap-2">
                        <div className="w-1/2 space-y-1">
                          <label className="text-[10px] font-semibold text-slate-300 uppercase">Children</label>
                          <input type="number" min="0" value={searchParams.children} onChange={e => setSearchParams({...searchParams, children: parseInt(e.target.value)})} className="w-full px-2 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500 text-sm" />
                        </div>
                        <div className="w-1/2 space-y-1">
                          <label className="text-[10px] font-semibold text-slate-300 uppercase">Infants</label>
                          <input type="number" min="0" value={searchParams.infants} onChange={e => setSearchParams({...searchParams, infants: parseInt(e.target.value)})} className="w-full px-2 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-1 sm:col-span-2 lg:col-span-4">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Cabin Class</label>
                        <select value={searchParams.cabinClass} onChange={e => setSearchParams({...searchParams, cabinClass: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500">
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">Premium Economy</option>
                          <option value="Business">Business</option>
                          <option value="First">First</option>
                        </select>
                      </div>
                   </div>
                 </>
               )}

               {activeTab === 'hotels' && (
                 <>
                   <div className="grid grid-cols-1 gap-4">
                     <CityAutocomplete label="Destination City" value={hotelSearchParams.destination} onChange={(v) => setHotelSearchParams({...hotelSearchParams, destination: v})} required />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Check-in</label>
                        <input type="date" value={hotelSearchParams.checkIn} onChange={e => setHotelSearchParams({...hotelSearchParams, checkIn: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Check-out</label>
                        <input type="date" value={hotelSearchParams.checkOut} onChange={e => setHotelSearchParams({...hotelSearchParams, checkOut: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Guests</label>
                        <input type="number" min="1" value={hotelSearchParams.guests} onChange={e => setHotelSearchParams({...hotelSearchParams, guests: parseInt(e.target.value)})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Rooms</label>
                        <input type="number" min="1" value={hotelSearchParams.rooms} onChange={e => setHotelSearchParams({...hotelSearchParams, rooms: parseInt(e.target.value)})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                   </div>
                 </>
               )}

               {activeTab === 'transfers' && (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <CityAutocomplete label="Pickup Location" value={transferSearchParams.pickup} onChange={(v) => setTransferSearchParams({...transferSearchParams, pickup: v})} required />
                     <CityAutocomplete label="Drop-off Location" value={transferSearchParams.dropoff} onChange={(v) => setTransferSearchParams({...transferSearchParams, dropoff: v})} required />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Date</label>
                        <input type="date" value={transferSearchParams.date} onChange={e => setTransferSearchParams({...transferSearchParams, date: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Time</label>
                        <input type="time" value={transferSearchParams.time} onChange={e => setTransferSearchParams({...transferSearchParams, time: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase">Passengers</label>
                        <input type="number" min="1" value={transferSearchParams.passengers} onChange={e => setTransferSearchParams({...transferSearchParams, passengers: parseInt(e.target.value)})} className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
                      </div>
                   </div>
                 </>
               )}

               <button 
                 onClick={handleSearch} 
                 disabled={isSearching}
                 className="w-full bg-yellow-500 text-blue-950 font-bold py-3 px-4 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isSearching ? (
                   <>
                     <Loader2 className="animate-spin mr-2 w-5 h-5" />
                     Searching real-time offers...
                   </>
                 ) : (
                   <>
                     Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <ChevronRight className="ml-2 w-5 h-5" />
                   </>
                 )}
               </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 relative"
          >
            {isRevalidating && (
              <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-slate-700">
                <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
                <div className="text-white font-semibold">Verifying availability...</div>
              </div>
            )}
            {searchError && !isRevalidating && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm font-medium mb-4">
                {searchError}
              </div>
            )}
            
            {activeTab === 'flights' && (
              <FlightResultsStep 
                offers={flightOffers}
                tripType={searchParams.tripType}
                onSelect={handleSelectFlight}
                onBack={() => setStep(1)}
              />
            )}
            
            {activeTab === 'hotels' && (
              <HotelResultsStep 
                offers={hotelOffers} 
                onSelect={handleSelectHotel}
                onBack={() => setStep(1)}
              />
            )}
            
            {activeTab === 'transfers' && (
              <TransferResultsStep 
                offers={transferOffers} 
                onSelect={handleSelectTransfer}
                onBack={() => setStep(1)}
              />
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <PassengerFormStep 
              details={passengerDetails}
              title={activeTab === 'flights' ? 'Passenger Details' : 'Guest Information'}
              onChange={setPassengerDetails}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <SeatSelectionStep 
              item={getActiveItem()}
              activeTab={activeTab}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <ReviewPayStep 
              item={getActiveItem()}
              activeTab={activeTab}
              passenger={passengerDetails}
              searchId={searchId}
              onNext={(ref) => {
                setPaymentRef(ref);
                setStep(6);
              }}
              onBack={() => setStep(4)}
            />
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <SuccessStep paymentRef={paymentRef!} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
