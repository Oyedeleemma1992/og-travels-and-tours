import { Outlet, Link, useLocation } from 'react-router-dom';
import { Plane, Menu, X, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { TikTokIcon } from './TikTokIcon';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Vacation Packages', path: '/packages' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <div className="flex min-h-screen flex-col font-sans text-slate-800 bg-slate-50">
      {/* Top Bar */}
      <div className="hidden bg-slate-900 py-2 text-xs text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <a href="mailto:info@ogtravelsandtours.com" className="flex items-center hover:text-yellow-500 transition-colors">
              <Mail className="mr-2 h-3 w-3" />
              info@ogtravelsandtours.com
            </a>
            <a href="tel:+2349038437161" className="flex items-center hover:text-yellow-500 transition-colors">
              <Phone className="mr-2 h-3 w-3" />
              +234 903 843 7161
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://www.facebook.com/share/186KNcqf5F/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors"><Facebook className="h-4 w-4" /></a>
            <a href="https://x.com/ogtravelsltd?s=21" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="https://www.instagram.com/ogtravelstours?igsh=MTI3Y280ZmRsdnRrdA==" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="https://www.tiktok.com/@ogtravelsandtours?_r=1&_t=ZS-98RocauTALn" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors"><TikTokIcon className="h-4 w-4" /></a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://i.ibb.co/Mxvy4spK/og-logo-removebg-preview.png" alt="OG Travels & Tours" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-sm font-semibold transition-colors hover:text-yellow-600',
                  location.pathname === link.path ? 'text-yellow-600' : 'text-slate-600'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="rounded-full bg-blue-950 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-900 hover:shadow-md"
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-blue-950"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white shadow-lg absolute top-[72px] left-0 w-full z-40"
          >
            <nav className="flex flex-col px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-base font-semibold transition-colors block py-2 border-b border-slate-100',
                    location.pathname === link.path ? 'text-yellow-600' : 'text-slate-600'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-4 rounded-lg bg-blue-950 px-6 py-3 text-center text-sm font-semibold text-white"
              >
                Book Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 pt-16 pb-8 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center mb-6">
                <img src="https://i.ibb.co/Mxvy4spK/og-logo-removebg-preview.png" alt="OG Travels & Tours" className="h-16 w-auto object-contain bg-white/10 rounded-lg p-2" />
              </Link>
              <p className="mb-6 text-sm leading-relaxed">
                Your trusted travel partner. We make international travel simple through comprehensive booking, visa, and vacation services.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/share/186KNcqf5F/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-yellow-500 transition-colors"><Facebook className="h-5 w-5" /></a>
                <a href="https://x.com/ogtravelsltd?s=21" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-yellow-500 transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="https://www.instagram.com/ogtravelstours?igsh=MTI3Y280ZmRsdnRrdA==" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-yellow-500 transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="https://www.tiktok.com/@ogtravelsandtours?_r=1&_t=ZS-98RocauTALn" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-yellow-500 transition-colors"><TikTokIcon className="h-5 w-5" /></a>
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold text-white">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/about" className="hover:text-yellow-500 transition-colors">About Us</Link></li>
                <li><Link to="/services" className="hover:text-yellow-500 transition-colors">Our Services</Link></li>
                <li><Link to="/packages" className="hover:text-yellow-500 transition-colors">Vacation Packages</Link></li>
                <li><Link to="/blog" className="hover:text-yellow-500 transition-colors">Travel Blog</Link></li>
                <li><Link to="/faq" className="hover:text-yellow-500 transition-colors">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-yellow-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold text-white">Our Services</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/flight-booking" className="hover:text-yellow-500 transition-colors">Flight Booking</Link></li>
                <li><Link to="/services/visa" className="hover:text-yellow-500 transition-colors">Visa Assistance</Link></li>
                <li><Link to="/hotel-reservation" className="hover:text-yellow-500 transition-colors">Hotel Reservations</Link></li>
                <li><Link to="/services/study" className="hover:text-yellow-500 transition-colors">Study Abroad</Link></li>
                <li><Link to="/services/canton" className="hover:text-yellow-500 transition-colors">China Canton Fair</Link></li>
                <li><Link to="/services/corporate" className="hover:text-yellow-500 transition-colors">Corporate Travel</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold text-white">Contact Info</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-yellow-500 shrink-0" />
                  <span>Suite FF002, First Floor, Right Wing, Block B, Sunbeth Filling Station, Opposite Dunamis Glory Dome, Airport Road, Lugbe, Abuja.</span>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-yellow-500 shrink-0" />
                  <span>+234 903 843 7161</span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-yellow-500 shrink-0" />
                  <span>info@ogtravelsandtours.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} OG Travels & Tours. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link to="/privacy" className="hover:text-yellow-500">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-yellow-500">Terms & Conditions</Link>
            </div>
            <div className="mt-4">
              <Link to="/admin" className="text-slate-600 hover:text-slate-400 text-xs">Admin Access</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2348110207299"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 p-3 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] transition-all z-50 hover:scale-110 active:scale-95"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-yellow-500 text-blue-950 shadow-lg hover:bg-yellow-400 transition-colors z-50"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
