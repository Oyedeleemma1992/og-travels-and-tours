import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, Map, Star, ShieldCheck, Briefcase, Car, Building, GraduationCap, Check, FileText } from 'lucide-react';
import { useState } from 'react';
import { TikTokIcon } from '../components/TikTokIcon';
import { setStorage, getStorage, generateId } from '../lib/storage';

const servicesData = {
  flights: {
    title: 'International Flight Booking',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop',
    description: 'Professional flight booking services for domestic and international travel.',
    features: ['Domestic Flights', 'International Flights', 'One-way & Return', 'Multi-city Itineraries', 'Corporate Rates'],
  },
  visa: {
    title: 'Tourist Visa Assistance',
    icon: Map,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop',
    description: 'Expert guidance through complex visa application processes.',
    features: ['Tourist Visas', 'Business Visas', 'Student Visas', 'Family Visit Visas', 'Application Review'],
  },
  hotels: {
    title: 'Hotel Reservation',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop',
    description: 'Find the perfect accommodation anywhere in the world.',
    features: ['Luxury Hotels', 'Budget Stays', 'Resorts', 'Serviced Apartments', 'Group Bookings'],
  },
  study: {
    title: 'Study Abroad Consultation',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop',
    description: 'Comprehensive support for students looking to study internationally.',
    features: ['University Admissions', 'Application Guidance', 'Student Visa Assistance', 'Pre-departure Support', 'Accommodation Search'],
  },
  canton: {
    title: 'Canton Fair Travel Packages',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1551281488-829d6fc57803?q=80&w=2000&auto=format&fit=crop',
    description: 'Dedicated travel packages for the world\'s largest trade fair.',
    features: ['Flight Arrangements', 'Hotel Near Fair', 'Visa Assistance', 'Airport Pickup', 'Business Travel Support'],
  },
  corporate: {
    title: 'Corporate Travel Management',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
    description: 'Streamlined travel management for businesses of all sizes.',
    features: ['Executive Travel', 'Company Flight Booking', 'Group Travel', 'Conference Travel', 'Account Management'],
  },
  pickup: {
    title: 'Airport Pickup & Transfers',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000&auto=format&fit=crop',
    description: 'Reliable airport transfer services.',
    features: ['Abuja Airport Pickup', 'Airport Drop-off', 'Executive Pickup', 'Group Transportation', 'VIP Transfer'],
  },
  insurance: {
    title: 'Travel Insurance',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop',
    description: 'Comprehensive travel insurance for peace of mind.',
    features: ['Medical Coverage', 'Trip Cancellation', 'Lost Baggage', 'Flight Delay', 'Emergency Evacuation'],
  },
  admission: {
    title: 'Admission Assistance',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop',
    description: 'Expert assistance for study abroad admissions.',
    features: ['University Selection', 'Application Process', 'Document Review', 'Personal Statement', 'Interview Prep'],
  },
  holiday: {
    title: 'Holiday & Vacation Packages',
    icon: Plane,
    description: 'Curated holiday packages tailored to give you the perfect vacation experience.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    features: ['Romantic Getaways', 'Family Vacations', 'Group Tours', 'All-Inclusive Stays', 'Custom Itineraries'],
  },
  chinavisa: {
    title: 'China Visa Processing',
    icon: FileText,
    description: 'Expert processing of all categories of Chinese visas with high success rates.',
    image: 'https://images.unsplash.com/photo-1543097692-fa1386d37365?q=80&w=1000&auto=format&fit=crop',
    features: ['Business Visas', 'Tourist Visas', 'Express Processing', 'Document Verification', 'Application Submission'],
  },
  consultation: {
    title: 'Travel Consultation',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop',
    description: 'Expert advice for planning your perfect trip.',
    features: ['Itinerary Planning', 'Destination Advice', 'Budgeting', 'Travel Tips', 'Documentation Check'],
  }
};

export default function Services() {
  const { id } = useParams<{ id: string }>();
  const service = id && id in servicesData ? servicesData[id as keyof typeof servicesData] : null;

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [studyDest, setStudyDest] = useState('');
  const [studyLvl, setStudyLvl] = useState('');
  const [studyIntake, setStudyIntake] = useState('');

  const handleSubmit = async (e: import('react').FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const dataObj = Object.fromEntries(formData.entries());
    const currentContacts = getStorage("contact_messages");
    setStorage("contact_messages", [{ id: generateId(), date: new Date().toISOString(), ...dataObj }, ...currentContacts]);

    formData.append("access_key", "7f2e666d-2669-4779-90e3-775a813679fd");
    if (service) {
      formData.append("subject", `New Service Request: ${service.title}`);
      formData.append("service_requested", service.title);
    }

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

  if (!id) {
    return (
      <div className="py-24 bg-slate-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-blue-950 mb-4">Our Services</h1>
            <p className="text-lg text-slate-600">Comprehensive travel solutions for all your needs.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(servicesData).map(([key, srv]) => (
              <Link key={key} to={`/services/${key}`} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-start">
                <div className="mr-4 mt-1 bg-blue-50 text-blue-950 p-3 rounded-xl">
                  <srv.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-950 mb-2">{srv.title}</h2>
                  <p className="text-slate-600 line-clamp-2 mb-4">{srv.description}</p>
                  <div className={`inline-flex items-center text-sm font-semibold ${key === 'admission' ? 'text-yellow-600' : 'text-blue-950'}`}>
                    {key === 'admission' ? 'Start Application' : 'Learn more'} 
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return <div className="py-24 text-center">Service not found.</div>;
  }

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <section className="relative flex py-32 items-center justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img src={service.image} alt={service.title} className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-500 text-blue-950 shadow-lg">
            <service.icon className="h-10 w-10" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {service.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-slate-300">
            {service.description}
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-blue-950 mb-6">What We Offer</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className="mt-1 mr-3 h-5 w-5 text-yellow-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
              <h3 className="text-2xl font-bold text-blue-950 mb-6">Request Service</h3>
              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <Check className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-blue-950 mb-2">Request Sent!</h4>
                  <p className="text-slate-600 mb-6">We will get back to you shortly.</p>
                  <button onClick={() => setFormStatus('idle')} className="text-blue-950 font-semibold hover:underline">Send another request</button>
                </div>
              ) : id === 'admission' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input name="first_name" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input name="last_name" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input name="email" required type="email" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input name="phone" required type="tel" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Study Destination</label>
                    <select name="study_destination" required value={studyDest} onChange={e => setStudyDest(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950">
                      <option value="">Select a destination</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Malta">Malta</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="China">China</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {studyDest === 'Other' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Specify Destination</label>
                      <input name="study_destination_other" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Level of Study</label>
                    <select name="level_of_study" required value={studyLvl} onChange={e => setStudyLvl(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950">
                      <option value="">Select level</option>
                      <option value="Foundation Programme">Foundation Programme</option>
                      <option value="Pre-Bachelor's">Pre-Bachelor's</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Pre-Master's">Pre-Master's</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="MBA">MBA</option>
                      <option value="PhD">PhD</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Postgraduate Diploma">Postgraduate Diploma</option>
                      <option value="Certificate Programme">Certificate Programme</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {studyLvl === 'Other' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Specify Level</label>
                      <input name="level_of_study_other" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Course of Study</label>
                    <input name="preferred_course" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Intake</label>
                    <select name="preferred_intake" required value={studyIntake} onChange={e => setStudyIntake(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950">
                      <option value="">Select intake</option>
                      <option value="January">January</option>
                      <option value="May">May</option>
                      <option value="September">September</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {studyIntake === 'Other' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Specify Intake</label>
                      <input name="preferred_intake_other" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Highest Qualification Obtained</label>
                      <input name="highest_qualification" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Year of Graduation</label>
                      <input name="graduation_year" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Valid International Passport?</label>
                      <select name="has_passport" required className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Previously Studied Abroad?</label>
                      <select name="studied_abroad" required className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Additional Comments</label>
                    <textarea name="message" rows={4} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"></textarea>
                  </div>
                  <button type="submit" disabled={formStatus === 'submitting'} className="w-full rounded-xl bg-blue-950 px-6 py-4 font-bold text-white transition-colors hover:bg-blue-900 disabled:opacity-70">
                    {formStatus === 'submitting' ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input name="first_name" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input name="last_name" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input name="email" required type="email" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input name="phone" required type="tel" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Additional Details</label>
                    <textarea name="message" rows={4} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"></textarea>
                  </div>
                  <button type="submit" disabled={formStatus === 'submitting'} className="w-full rounded-xl bg-blue-950 px-6 py-4 font-bold text-white transition-colors hover:bg-blue-900 disabled:opacity-70">
                    {formStatus === 'submitting' ? 'Submitting...' : 'Send Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
