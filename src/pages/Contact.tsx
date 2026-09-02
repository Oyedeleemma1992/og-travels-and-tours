import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, Check, Facebook, Twitter, Instagram } from 'lucide-react';
import { useState } from 'react';
import { TikTokIcon } from '../components/TikTokIcon';
import { setStorage, getStorage, generateId } from '../lib/storage';

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: import('react').FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.target as HTMLFormElement);
    const dataObj = Object.fromEntries(formData.entries());
    const currentContacts = getStorage("contact_messages");
    setStorage("contact_messages", [{ id: generateId(), date: new Date().toISOString(), ...dataObj }, ...currentContacts]);
    formData.append("access_key", "7f2e666d-2669-4779-90e3-775a813679fd");

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
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setFormStatus('idle');
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-50">
      {/* Header */}
      <section className="relative flex py-32 items-center justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000&auto=format&fit=crop"
            alt="Contact Us"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300"
          >
            We're here to help you plan your next adventure.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-blue-950 mb-6">Get In Touch</h2>
              <p className="text-lg text-slate-600 mb-12">
                Have a question about our services or ready to book a trip? Reach out to us using any of the methods below or fill out the contact form.
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-950 shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-950 mb-1">Our Office</h3>
                    <p className="text-slate-600">Suite FF002, First Floor, Right Wing, Block B,<br />Sunbeth Filling Station, Opposite Dunamis Glory Dome,<br />Airport Road, Lugbe, Abuja.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-950 shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-950 mb-1">Phone Number</h3>
                    <p className="text-slate-600">+234 903 843 7161</p>
                    <a href="https://wa.me/2348110207299" className="inline-block mt-2 text-green-600 font-semibold hover:underline">
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-950 shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-950 mb-1">Email Address</h3>
                    <p className="text-slate-600">info@ogtravelsandtours.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-950 shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-950 mb-1">Business Hours</h3>
                    <p className="text-slate-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-xl font-bold text-blue-950 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/share/186KNcqf5F/" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-white hover:bg-yellow-500 transition-colors shadow-sm">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="https://x.com/ogtravelsltd?s=21" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-white hover:bg-yellow-500 transition-colors shadow-sm">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="https://www.instagram.com/ogtravelstours?igsh=MTI3Y280ZmRsdnRrdA==" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-white hover:bg-yellow-500 transition-colors shadow-sm">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="https://www.tiktok.com/@ogtravelsandtours?_r=1&_t=ZS-98RocauTALn" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-white hover:bg-yellow-500 transition-colors shadow-sm">
                      <TikTokIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
              <h3 className="text-2xl font-bold text-blue-950 mb-6">Send Us a Message</h3>
              
              {formStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <Check className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-blue-950 mb-2">Message Sent!</h4>
                  <p className="text-slate-600">Your inquiry has been received. A member of the OG Travels & Tours team will contact you during business hours.</p>
                  <button onClick={() => setFormStatus('idle')} className="mt-8 text-blue-950 font-semibold hover:underline">
                    Send another message
                  </button>
                </div>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <input name="subject" required type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea name="message" required rows={5} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full rounded-xl bg-blue-950 px-6 py-4 font-bold text-white transition-colors hover:bg-blue-900 disabled:opacity-70 flex items-center justify-center"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : (
                      <>
                        <Send className="mr-2 h-5 w-5" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Live Office Location Map */}
      <section className="h-96 w-full bg-slate-200">
        <iframe
          src="https://maps.google.com/maps?q=Sunbeth%20Filling%20Station,%20Airport%20Road,%20Lugbe,%20Abuja&t=&z=13&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}
