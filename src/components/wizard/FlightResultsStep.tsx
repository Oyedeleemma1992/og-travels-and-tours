import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, ArrowRight, Clock, Briefcase, ChevronLeft, Calendar } from 'lucide-react';

interface FlightResultsStepProps {
  offers: any[];
  tripType: string;
  onSelect: (flight: any) => void;
  onBack: () => void;
}

export function FlightResultsStep({ offers, tripType, onSelect, onBack }: FlightResultsStepProps) {
  const [selectionStage, setSelectionStage] = useState<'outbound' | 'return'>('outbound');
  const [selectedOutboundId, setSelectedOutboundId] = useState<string | null>(null);

  if (!offers || offers.length === 0) {
    return (
      <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-700 text-center">
        <Plane className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No flights found</h3>
        <p className="text-slate-400 mb-6">We couldn't find any real-time flight offers for this route. Please try adjusting your dates or locations.</p>
        <button 
          onClick={onBack}
          className="inline-flex items-center text-yellow-500 hover:text-yellow-400 font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Search
        </button>
      </div>
    );
  }

  // To simulate splitting the outbound vs return slices for round-trips:
  // We can group offers based on their outbound slices, then filter for return slices.
  // Many API structures (like Duffel/FX-Port) return bundled offers.
  // We will display all unique outbound segments first, if round trip.
  
  const handleSelectSlice = (offer: any) => {
    if (tripType === 'round' && selectionStage === 'outbound') {
      setSelectedOutboundId(offer.id);
      setSelectionStage('return');
    } else {
      onSelect(offer);
    }
  };

  const handleBack = () => {
    if (tripType === 'round' && selectionStage === 'return') {
      setSelectionStage('outbound');
      setSelectedOutboundId(null);
    } else {
      onBack();
    }
  };

  // If in 'return' stage, ideally we'd filter offers that match the selected outbound slice.
  // For standard "Bundled Offer" APIs, picking an outbound means picking the Offer.
  // But to satisfy the "select outbound, then select return" UI flow, we will display
  // the Outbound slices of all offers first. When one is clicked, we filter offers
  // that have that exact Outbound slice, and display their Return slices.

  let displayOffers = offers;
  
  if (tripType === 'round') {
    if (selectionStage === 'outbound') {
      // Remove duplicate outbound slices to show a clean list of outbound options
      const seenOutbounds = new Set();
      displayOffers = offers.filter(offer => {
        const outboundSliceId = offer.slices?.[0]?.id || offer.slices?.[0]?.segments?.[0]?.operating_carrier_flight_number || offer.id;
        if (seenOutbounds.has(outboundSliceId)) return false;
        seenOutbounds.add(outboundSliceId);
        return true;
      });
    } else {
      // Filter offers to only those matching the selected outbound flight
      const selectedOffer = offers.find(o => o.id === selectedOutboundId);
      const outboundSliceId = selectedOffer?.slices?.[0]?.id || selectedOffer?.slices?.[0]?.segments?.[0]?.operating_carrier_flight_number;
      
      displayOffers = offers.filter(offer => {
        const thisOutboundId = offer.slices?.[0]?.id || offer.slices?.[0]?.segments?.[0]?.operating_carrier_flight_number;
        return thisOutboundId === outboundSliceId;
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 text-white">
        <button 
          onClick={handleBack}
          className="inline-flex items-center text-slate-300 hover:text-white text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> {selectionStage === 'return' ? 'Change Outbound Flight' : 'Edit Search'}
        </button>
        <div className="text-sm font-bold text-yellow-500">
          {tripType === 'round' ? (selectionStage === 'outbound' ? '1. Select Departure Flight' : '2. Select Return Flight') : 'Select Flight'}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={selectionStage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
        >
          {displayOffers.map((offer, idx) => {
            const airlineName = offer.owner?.name || offer.airline || 'Unknown Airline';
            const price = offer.total_amount || offer.price || 'N/A';
            const currency = offer.total_currency || offer.currency || 'NGN';
            
            // Determine which slice to show based on the selection stage
            const sliceIndex = (tripType === 'round' && selectionStage === 'return') ? 1 : 0;
            const slice = offer.slices?.[sliceIndex] || offer.outbound || {};
            const segments = slice.segments || [];
            const firstSegment = segments[0] || {};
            const lastSegment = segments[segments.length - 1] || {};
            
            const departureTime = firstSegment.departing_at || offer.departureTime || '--:--';
            const arrivalTime = lastSegment.arriving_at || offer.arrivalTime || '--:--';
            const originCode = firstSegment.origin?.iata_code || offer.origin || 'N/A';
            const destCode = lastSegment.destination?.iata_code || offer.destination || 'N/A';
            
            const durationStr = slice.duration ? 
              slice.duration.replace('PT', '').toLowerCase() : 
              (offer.duration || '--h --m');
            
            const stops = segments.length > 1 ? `${segments.length - 1} stop(s)` : 'Non-stop';
            const flightNumber = firstSegment.operating_carrier_flight_number ? 
              `${firstSegment.operating_carrier?.iata_code} ${firstSegment.operating_carrier_flight_number}` : 
              (offer.flightNumber || 'N/A');

            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={offer.id || idx} 
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center hover:border-yellow-500 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => handleSelectSlice(offer)}
              >
                <div className="flex-1 w-full space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {offer.owner?.logo_symbol_url ? (
                        <img src={offer.owner.logo_symbol_url} alt={airlineName} className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                          <Plane className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-blue-950">{airlineName}</div>
                        <div className="text-xs text-slate-500">{flightNumber}</div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center">
                      {sliceIndex === 1 ? <Calendar className="w-3 h-3 mr-1" /> : null}
                      {stops}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-center relative px-2">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10 border-dashed border-b border-slate-300"></div>
                    
                    <div className="bg-white pr-2">
                      <div className="font-black text-xl text-blue-950">
                        {new Date(departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace('Invalid Date', departureTime.substring(11,16) || '--:--')}
                      </div>
                      <div className="text-sm font-semibold text-slate-500">{originCode}</div>
                    </div>
                    
                    <div className="bg-white px-2 text-slate-400 flex flex-col items-center">
                      <div className="text-xs mb-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> {durationStr}</div>
                      <Plane className={`w-4 h-4 text-yellow-500 ${sliceIndex === 1 ? '-rotate-90' : 'rotate-90'}`} />
                    </div>

                    <div className="bg-white pl-2">
                      <div className="font-black text-xl text-blue-950">
                        {new Date(arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace('Invalid Date', arrivalTime.substring(11,16) || '--:--')}
                      </div>
                      <div className="text-sm font-semibold text-slate-500">{destCode}</div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end md:border-l md:border-slate-100 md:pl-6">
                  <div className="text-sm text-slate-500 mb-1 flex items-center">
                    <Briefcase className="w-3 h-3 mr-1" /> Checked bag included
                  </div>
                  {selectionStage === 'return' || tripType === 'one' ? (
                    <div className="text-2xl font-black text-blue-950 mb-3">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency }).format(Number(price))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 mb-3">
                      Price shown on next step
                    </div>
                  )}
                  <button 
                    className="w-full bg-blue-950 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-yellow-500 hover:text-blue-950 transition-colors flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-blue-950"
                  >
                    Select <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
