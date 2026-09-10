import { useState } from 'react';
import { motion } from 'motion/react';
import { Plane, CalendarCheck, Check, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function FlightBooking() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'search' | 'visa'>(
    searchParams.get('tab') === 'visa' ? 'visa' : 'search'
  );
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleVisaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const dataObj = Object.fromEntries(formData.entries());

    const passenger = {
      firstName: (dataObj.full_name as string).split(' ')[0] || '',
      lastName: (dataObj.full_name as string).split(' ').slice(1).join(' ') || '',
      email: dataObj.email,
      phone: dataObj.phone,
    };

    const flightData = {
      title: `Custom Itinerary: ${dataObj.departure_city} to ${dataObj.destination}`,
      airline: dataObj.preferred_airline || 'Any',
      slices: [
        {
          origin_name: dataObj.departure_city,
          destination_name: dataObj.destination,
          departure_time: dataObj.departure_date,
          arrival_time: dataObj.return_date || dataObj.departure_date,
        }
      ]
    };

    try {
      const response = await fetch("/api/v1/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: dataObj.email,
          amount: 1000000,
          metadata: {
            type: "visa_reservation",
            custom_fields: [
              { display_name: "Full Name", variable_name: "full_name", value: dataObj.full_name },
              { display_name: "Phone", variable_name: "phone", value: dataObj.phone }
            ]
          },
          flightData,
          passenger
        })
      });

      const data = await response.json();

      if (data.status && data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        console.error("Payment initialization failed", data);
        setFormStatus('idle');
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setFormStatus('idle');
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen text-slate-800">
      <section className="relative flex py-24 md:py-32 items-center justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
            alt="Flight Booking"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
          >
            Flight Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-slate-300"
          >
            Book global flights or reserve itineraries for your visa applications.
          </motion.p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 sm:px-8 py-3.5 rounded-full font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 shadow-sm ${
                activeTab === 'search'
                  ? 'bg-blue-950 text-white scale-105 shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Plane className="w-5 h-5" /> Live Flight Booking
            </button>
            <button
              onClick={() => setActiveTab('visa')}
              className={`px-6 sm:px-8 py-3.5 rounded-full font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 shadow-sm ${
                activeTab === 'visa'
                  ? 'bg-blue-950 text-white scale-105 shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CalendarCheck className="w-5 h-5" /> Visa Reservation (Itinerary)
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 md:p-12 border border-slate-100 min-h-[500px]">
            {/* Live Flight Booking Search Tab */}
            <div className={activeTab === 'search' ? 'block w-full' : 'hidden'}>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-3">Book Your Flights</h2>
                <p className="text-sm sm:text-base text-slate-600">Search and compare the best flight deals securely via our partner network.</p>
              </div>

              {/* Official Travelpayouts Widget - loaded in isolated iframe */}
              <div className="w-full">
                <iframe
                  src="/tpwl-widget.html"
                  title="Flight Search Widget"
                  className="w-full border-0"
                  style={{ minHeight: '700px' }}
                />
              </div>
            </div>

            {/* Visa Reservation Tab */}
            {activeTab === 'visa' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-3">Visa Itinerary Reservation</h2>
                  <p className="text-sm sm:text-base text-slate-600 mb-6">
                    Need a verifiable flight itinerary for your visa application without paying for the full ticket yet? 
                    Fill out the form below. A service fee of <strong>₦10,000</strong> applies.
                  </p>
                </div>

                {formStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                      <Check className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-950 mb-4">Payment Successful!</h3>
                    <p className="text-base text-slate-600 mb-8">Your itinerary is being generated and will be sent to your email shortly.</p>
                    <button onClick={() => setFormStatus('idle')} className="text-blue-950 font-semibold hover:underline">
                      Make another reservation
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVisaSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input name="full_name" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <input name="email" required type="email" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                        <input name="phone" required type="tel" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Departure City</label>
                        <input name="departure_city" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
                        <input name="destination" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Cabin Class</label>
                        <select name="cabin_class" required className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950">
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">Premium Economy</option>
                          <option value="Business">Business</option>
                          <option value="First Class">First Class</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Departure Date</label>
                        <input name="departure_date" required type="date" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Return Date (Optional)</label>
                        <input name="return_date" type="date" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Airline (Optional)</label>
                      <input name="preferred_airline" type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full rounded-xl bg-blue-950 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-900 disabled:opacity-70 flex items-center justify-center shadow-lg"
                    >
                      {formStatus === 'submitting' ? (
                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Initializing Payment...</>
                      ) : (
                        'Pay ₦10,000 & Generate Itinerary'
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}