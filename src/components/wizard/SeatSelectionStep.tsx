import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, BedDouble, Car } from 'lucide-react';

interface SeatSelectionStepProps {
  item: any;
  activeTab: 'flights' | 'hotels' | 'transfers';
  onNext: () => void;
  onBack: () => void;
}

export function SeatSelectionStep({ item, activeTab, onNext, onBack }: SeatSelectionStepProps) {
  const [preference, setPreference] = useState('Any');
  
  const providerName = activeTab === 'flights' 
    ? (item?.owner?.name || item?.airline || 'Airline')
    : activeTab === 'hotels'
      ? (item?.name || 'Hotel')
      : (item?.vehicleType || 'Transfer Service');

  return (
    <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700 text-white">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <h3 className="text-xl font-bold">Trip Summary & Extras</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
            <h4 className="font-semibold mb-3 text-yellow-500">Summary</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Provider</span>
                <span className="font-medium text-right ml-2">{providerName}</span>
              </div>
              
              {activeTab === 'flights' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class</span>
                    <span className="font-medium">{item?.cabin_class || 'Economy'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Baggage</span>
                    <span className="font-medium">Standard Included</span>
                  </div>
                </>
              )}
              
              {activeTab === 'hotels' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location</span>
                    <span className="font-medium">{item?.location || 'City'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Breakfast</span>
                    <span className="font-medium">Included</span>
                  </div>
                </>
              )}
              
              {activeTab === 'transfers' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Capacity</span>
                    <span className="font-medium">Up to {item?.capacity || 3} pass.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className="font-medium">Private</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-white mb-2">
            {activeTab === 'flights' ? 'Seat Preference' : activeTab === 'hotels' ? 'Room Preference' : 'Vehicle Preference'}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {(activeTab === 'flights' ? ['Window', 'Any', 'Aisle'] : 
              activeTab === 'hotels' ? ['King', 'Any', 'Twin'] : 
              ['Standard', 'Any', 'Premium']).map(pref => (
              <button
                key={pref}
                onClick={() => setPreference(pref)}
                className={`py-3 px-2 rounded-lg border text-sm font-medium transition-colors text-center ${
                  preference === pref 
                    ? 'bg-yellow-500 border-yellow-500 text-blue-950' 
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            * Preferences are recorded but not guaranteed until confirmation.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-700">
        <button type="button" onClick={onBack} className="inline-flex items-center text-slate-300 hover:text-white font-medium transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <button onClick={onNext} className="bg-yellow-500 text-blue-950 font-bold py-3 px-6 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center">
          Continue to Checkout <ChevronRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
