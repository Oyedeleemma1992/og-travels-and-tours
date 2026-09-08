import type { ChangeEvent, FormEvent } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

interface PassengerFormStepProps {
  details: any;
  title?: string;
  onChange: (details: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PassengerFormStep({ details, title = 'Passenger Information', onChange, onNext, onBack }: PassengerFormStepProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...details, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700 text-white">
      <div className="flex items-center mb-6 border-b border-slate-700 pb-4">
        <User className="w-6 h-6 text-yellow-500 mr-2" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Title</label>
            <select name="title" value={details.title} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500">
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
          
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 uppercase">Date of Birth</label>
            <input type="date" name="dob" value={details.dob} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">First Name</label>
            <input type="text" name="firstName" value={details.firstName} onChange={handleChange} required placeholder="As it appears on passport" className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Last Name</label>
            <input type="text" name="lastName" value={details.lastName} onChange={handleChange} required placeholder="As it appears on passport" className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Email Address</label>
            <input type="email" name="email" value={details.email} onChange={handleChange} required placeholder="Your email for itinerary delivery" className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Phone Number</label>
            <input type="tel" name="phone" value={details.phone} onChange={handleChange} required placeholder="Contact number" className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500" />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
          <button type="button" onClick={onBack} className="inline-flex items-center text-slate-300 hover:text-white font-medium transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          <button type="submit" className="bg-yellow-500 text-blue-950 font-bold py-3 px-6 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center">
            Continue to Review <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
