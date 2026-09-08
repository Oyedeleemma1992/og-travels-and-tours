import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hotel, ArrowRight, MapPin, Users, Star, ChevronLeft } from 'lucide-react';

interface HotelResultsStepProps {
  offers: any[];
  onSelect: (hotel: any) => void;
  onBack: () => void;
}

export function HotelResultsStep({ offers, onSelect, onBack }: HotelResultsStepProps) {
  if (!offers || offers.length === 0) {
    return (
      <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-700 text-center">
        <Hotel className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No hotels found</h3>
        <p className="text-slate-400 mb-6">We couldn't find any hotel offers for this location and dates. Please try adjusting your search.</p>
        <button 
          onClick={onBack}
          className="inline-flex items-center text-yellow-500 hover:text-yellow-400 font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 text-white">
        <button 
          onClick={onBack}
          className="inline-flex items-center text-slate-300 hover:text-white text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Edit Search
        </button>
        <div className="text-sm font-bold text-yellow-500">Select Hotel</div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {offers.map((offer, idx) => {
          const hotelName = offer.name || 'Premium Hotel';
          const price = offer.price || 'N/A';
          const currency = offer.currency || 'NGN';
          const rating = offer.rating || 4;
          const location = offer.location || 'City Center';

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={offer.id || idx} 
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center hover:border-yellow-500 hover:shadow-md transition-all group cursor-pointer"
              onClick={() => onSelect(offer)}
            >
              <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden">
                {offer.image ? (
                  <img src={offer.image} alt={hotelName} className="w-full h-full object-cover" />
                ) : (
                  <Hotel className="w-10 h-10" />
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center space-x-1 text-yellow-500">
                  {Array(rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="font-bold text-xl text-blue-950">{hotelName}</div>
                <div className="text-sm font-medium text-slate-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {location}
                </div>
                <div className="text-xs text-slate-500 flex items-center mt-2">
                  <Users className="w-4 h-4 mr-1" /> Room accommodates selected guests
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col items-end md:border-l md:border-slate-100 md:pl-6">
                <div className="text-sm text-slate-500 mb-1">Per night</div>
                <div className="text-2xl font-black text-blue-950 mb-3">
                  {new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency }).format(Number(price))}
                </div>
                <button 
                  className="w-full bg-blue-950 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-yellow-500 hover:text-blue-950 transition-colors flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-blue-950"
                >
                  Select Room <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
