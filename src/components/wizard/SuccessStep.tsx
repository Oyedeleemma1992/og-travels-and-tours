import { useState } from 'react';
import { CheckCircle2, Download, Plane, Map, Hotel, Globe, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuccessStepProps {
  paymentRef: string;
}

export function SuccessStep({ paymentRef }: SuccessStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/v1/itinerary/download/${paymentRef}`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch itinerary document.');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OG-Travels-Itinerary-${paymentRef}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Failed to download itinerary. Please contact support.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-700 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-slate-300 mb-6 text-lg">Your travel itinerary has been generated successfully and sent to your email.</p>
        
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex bg-yellow-500 text-blue-950 font-bold py-4 px-8 rounded-xl hover:bg-yellow-400 transition items-center justify-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Preparing PDF...</>
          ) : (
            <><Download className="w-5 h-5 mr-2" /> Download Itinerary PDF</>
          )}
        </button>
        <div className="text-sm text-slate-500 mt-4">Reference: {paymentRef}</div>
      </div>

      <div className="pt-6 border-t border-white/10">
        <h3 className="text-white font-semibold mb-4 text-center">Explore More OG Travels Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Globe, title: 'Visa Assistance', link: '/services/visa' },
            { icon: Hotel, title: 'Hotel Booking', link: '/services/hotels' },
            { icon: Map, title: 'Vacation Packages', link: '/packages' },
            { icon: Plane, title: 'Real Flights', link: '/flight-booking' },
          ].map((srv, idx) => (
            <Link key={idx} to={srv.link} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-yellow-500 hover:bg-slate-800 transition text-center group">
              <srv.icon className="w-6 h-6 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm text-slate-200 font-medium">{srv.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
