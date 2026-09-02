import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Plane } from 'lucide-react';
import { setStorage, getStorage, generateId } from '../lib/storage';

export default function FlightBooking() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: import('react').FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.target as HTMLFormElement);
    const dataObj = Object.fromEntries(formData.entries());
    
    // Save to Admin Dashboard
    const currentBookings = getStorage('flight_bookings');
    setStorage('flight_bookings', [{ id: generateId(), date: new Date().toISOString(), ...dataObj }, ...currentBookings]);

    formData.append("access_key", "7f2e666d-2669-4779-90e3-775a813679fd");
    formData.append("subject", "New Flight Booking Request");

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
        alert("Failed to send request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setFormStatus('idle');
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <section className="relative flex py-32 items-center justify-center overflow-hidden bg-blue-950">
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
            className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Flight Booking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 sm:text-xl"
          >
            Book your flights to any destination worldwide.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-950 mr-4">
                <Plane className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-blue-950">Flight Booking Request</h2>
            </div>
            
            {formStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                  <Check className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-blue-950 mb-4">Request Sent Successfully!</h3>
                <p className="text-lg text-slate-600 mb-8">Thank you! Your flight booking request has been received. Our team will contact you shortly.</p>
                <button onClick={() => setFormStatus('idle')} className="text-blue-950 font-semibold hover:underline">
                  Make another booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input name="full_name" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input name="email" required type="email" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input name="phone" required type="tel" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Departure City</label>
                    <input name="departure_city" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
                    <input name="destination" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cabin Class</label>
                    <select name="cabin_class" required className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950">
                      <option value="Economy">Economy</option>
                      <option value="Premium Economy">Premium Economy</option>
                      <option value="Business">Business</option>
                      <option value="First Class">First Class</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Departure Date</label>
                    <input name="departure_date" required type="date" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Return Date (Optional)</label>
                    <input name="return_date" type="date" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Number of Adults</label>
                    <input name="adults" required type="number" min="1" defaultValue="1" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Number of Children</label>
                    <input name="children" required type="number" min="0" defaultValue="0" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Airline (Optional)</label>
                  <input name="preferred_airline" type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                  <textarea name="notes" rows={4} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full rounded-xl bg-blue-950 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-900 disabled:opacity-70 flex items-center justify-center"
                >
                  {formStatus === 'submitting' ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
