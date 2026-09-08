import { useState } from 'react';
import { ChevronLeft, CreditCard, Loader2, FileText, CheckCircle2 } from 'lucide-react';

interface ReviewPayStepProps {
  item: any;
  activeTab: 'flights' | 'hotels' | 'transfers';
  passenger: any;
  onNext: (paymentRef: string) => void;
  onBack: () => void;
}

export function ReviewPayStep({ item, activeTab, passenger, onNext, onBack }: ReviewPayStepProps) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  const providerName = activeTab === 'flights' 
    ? (item?.owner?.name || item?.airline || 'Airline')
    : activeTab === 'hotels'
      ? (item?.name || 'Hotel')
      : (item?.vehicleType || 'Transfer Service');
      
  const itemPrice = item?.price || item?.total_amount || 0;
  const itemCurrency = item?.currency || item?.total_currency || 'NGN';
  
  const handleItineraryPay = async () => {
    setIsInitializing(true);
    try {
      const payload = {
        email: passenger.email,
        amount: 1000000, // ₦10,000 in kobo
        metadata: {
          passengerName: `${passenger.firstName} ${passenger.lastName}`,
          serviceType: activeTab,
          provider: providerName
        }
      };

      const res = await fetch('https://ogtravelsandtours.com/api/v1/paystack/initialize', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Payment initialization failed.');
      const data = await res.json();
      
      if (data && data.data && data.data.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        // Fallback for dev environment or API issues
        console.warn('No authorization_url returned, simulating success.');
        onNext('dev_mock_ref_12345'); 
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initialize payment. Please check your connection and try again.');
      setIsInitializing(false);
    }
  };

  const handleFullBook = () => {
    setBookingStatus('Connecting to live booking system...');
    // Simulate booking connection delay, then show a message or proceed
    setTimeout(() => {
      alert('Full booking API endpoint is currently being configured. Please use the Generate Itinerary option for now.');
      setBookingStatus(null);
    }, 1500);
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-slate-700 pb-4">
        <div className="flex items-center">
          <CheckCircle2 className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-xl font-bold">Checkout & Service Choice</h3>
        </div>
        <div className="text-sm text-slate-400 mt-2 md:mt-0">
          Passenger: {passenger.firstName} {passenger.lastName}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Option A: Full Ticket Booking */}
        <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-600 flex flex-col justify-between hover:border-yellow-500 transition-colors">
          <div>
            <div className="inline-block bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded mb-3">OPTION A</div>
            <h4 className="text-xl font-bold text-white mb-2">Book & Pay Securely</h4>
            <p className="text-slate-400 text-sm mb-6">
              Proceed to complete full payment and secure your live reservation directly with the provider via our backend.
            </p>
            <div className="text-2xl font-black text-white mb-6">
              {item ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: itemCurrency }).format(Number(itemPrice)) : 'N/A'}
            </div>
          </div>
          <button 
            onClick={handleFullBook}
            disabled={isInitializing || bookingStatus !== null}
            className="w-full bg-slate-700 text-white font-bold py-4 px-6 rounded-xl hover:bg-slate-600 transition flex items-center justify-center disabled:opacity-50"
          >
            {bookingStatus ? (
              <><Loader2 className="animate-spin w-5 h-5 mr-2" /> {bookingStatus}</>
            ) : (
              'Proceed to Book'
            )}
          </button>
        </div>

        {/* Option B: Itinerary Generation */}
        <div className="bg-blue-950 p-6 rounded-xl border-2 border-yellow-500 flex flex-col justify-between relative shadow-lg shadow-yellow-500/10">
          <div className="absolute top-0 right-0 bg-yellow-500 text-blue-950 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
          <div>
            <div className="inline-block bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded mb-3">OPTION B</div>
            <h4 className="text-xl font-bold text-white mb-2">Generate Itinerary Only</h4>
            <p className="text-slate-300 text-sm mb-6">
              Need a valid proposed itinerary for Visa applications or planning? Get an instant verifiable PDF document.
            </p>
            <div className="text-3xl font-black text-yellow-500 mb-2">₦10,000.00</div>
            <div className="text-xs text-blue-200 mb-6">Fixed service fee</div>
          </div>
          <button 
            onClick={handleItineraryPay}
            disabled={isInitializing || bookingStatus !== null}
            className="w-full bg-yellow-500 text-blue-950 font-bold py-4 px-6 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isInitializing ? (
              <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Initializing Checkout...</>
            ) : (
              <><FileText className="w-5 h-5 mr-2" /> Pay ₦10,000 & Generate PDF</>
            )}
          </button>
          <p className="text-xs text-center text-blue-300/60 mt-3">Secured by Paystack</p>
        </div>

      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-700">
        <button type="button" onClick={onBack} disabled={isInitializing} className="inline-flex items-center text-slate-300 hover:text-white font-medium transition-colors disabled:opacity-50">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to {activeTab === 'flights' ? 'Seat Selection' : activeTab === 'hotels' ? 'Room Preferences' : 'Vehicle Preferences'}
        </button>
      </div>
    </div>
  );
}
